import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {execFile as execFileCallback} from 'node:child_process'
import {promisify} from 'node:util'
import {beforeAll, describe, expect, test} from '@rstest/core'
import {buildCreateReport} from '../src/agent-create/report'
import {parseCreateIntent} from '../src/agent-create/intent'
import {createProjectPlan} from '../src/agent-create/planner'
import {applyCreateReportExitStatus} from '../src/script/create'

const execFile = promisify(execFileCallback)
const repoRoot = path.resolve(import.meta.dirname, '../../..')
const cliPath = path.join(repoRoot, 'packages/cli/bin/emp.js')

async function runCli(args: string[], cwd = repoRoot) {
  return execFile(process.execPath, [cliPath, ...args], {
    cwd,
    maxBuffer: 1024 * 1024,
  })
}

async function withTempDir<T>(callback: (tmpRoot: string) => Promise<T>): Promise<T> {
  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'emp-cli-create-'))
  try {
    return await callback(tmpRoot)
  } finally {
    await fs.rm(tmpRoot, {recursive: true, force: true})
  }
}

function createFailedReport(targetDir: string) {
  const plan = createProjectPlan(parseCreateIntent('React 主应用 + Vue 子应用'), {
    targetDir,
    dryRun: false,
    install: false,
    dev: false,
    verify: true,
    json: false,
  })

  return buildCreateReport(
    plan,
    [{name: 'host-config', status: 'failed', message: 'host 未配置 user remote'}],
    [],
  )
}

describe('emp create CLI', () => {
  beforeAll(async () => {
    await execFile('pnpm', ['--filter', '@empjs/cli', 'build'], {
      cwd: repoRoot,
      maxBuffer: 1024 * 1024,
    })
  }, 120_000)

  test('shows create help with agent-first options', async () => {
    const {stdout} = await runCli(['create', '--help'])

    expect(stdout).toMatch(/创建 EMP 新项目/)
    expect(stdout).toMatch(/--dir/)
    expect(stdout).toMatch(/--dry-run/)
    expect(stdout).toMatch(/--skip-install/)
    expect(stdout).toMatch(/--skip-dev/)
    expect(stdout).toMatch(/--skip-verify/)
    expect(stdout).toMatch(/--json/)
  })

  test('prints dry-run JSON with planned files without creating targetDir', async () => {
    await withTempDir(async tmpRoot => {
      const targetDir = path.join(tmpRoot, 'dry-run-app')

      const {stdout} = await runCli([
        'create',
        'React 主应用 + Vue 子应用',
        '--dir',
        targetDir,
        '--dry-run',
        '--json',
      ])

      const result = JSON.parse(stdout)
      expect(result.files).toContain('emp.intent.yaml')
      expect(result.files).toContain('apps/host/emp.config.ts')
      expect(result.files).toContain('apps/user/emp.config.ts')
      await expect(fs.stat(targetDir)).rejects.toThrow(/ENOENT/)
    })
  })

  test('writes passed emp-report.json in skip command mode', async () => {
    await withTempDir(async tmpRoot => {
      const targetDir = path.join(tmpRoot, 'write-app')

      const {stdout} = await runCli([
        'create',
        'React 主应用 + Vue 子应用',
        '--dir',
        targetDir,
        '--skip-install',
        '--skip-dev',
        '--json',
      ])

      const result = JSON.parse(stdout)
      const reportJson = JSON.parse(
        await fs.readFile(path.join(targetDir, 'emp-report.json'), 'utf8'),
      )

      expect(result.report.status).toBe('passed')
      expect(reportJson.status).toBe('passed')
      expect(reportJson.commands).toEqual([])
    })
  })

  test('marks process failed and prints failure summary for failed reports', () => {
    const previousExitCode = process.exitCode
    const previousLog = console.log
    const messages: string[] = []
    const reportPath = path.join(os.tmpdir(), 'emp-report.json')

    try {
      process.exitCode = undefined
      console.log = (...args: unknown[]) => {
        messages.push(args.join(' '))
      }

      applyCreateReportExitStatus(
        createFailedReport(path.join(os.tmpdir(), 'failed-app')),
        reportPath,
        false,
      )

      expect(process.exitCode).toBe(1)
      expect(messages.join('\n')).toMatch(/EMP 新项目创建失败/)
      expect(messages.join('\n')).toContain(reportPath)
    } finally {
      console.log = previousLog
      process.exitCode = previousExitCode
    }
  })

  test('writes emp-report.json with empty checks when skip verify JSON mode is used', async () => {
    await withTempDir(async tmpRoot => {
      const targetDir = path.join(tmpRoot, 'skip-verify-app')

      const {stdout} = await runCli([
        'create',
        'React 主应用 + Vue 子应用',
        '--dir',
        targetDir,
        '--skip-verify',
        '--json',
      ])

      const result = JSON.parse(stdout)
      const reportJson = JSON.parse(
        await fs.readFile(path.join(targetDir, 'emp-report.json'), 'utf8'),
      )

      expect(result.report.status).toBe('passed')
      expect(result.report.checks).toEqual([])
      expect(reportJson.status).toBe('passed')
      expect(reportJson.checks).toEqual([])
    })
  })
})
