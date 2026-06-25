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

interface ExecFileError extends Error {
  code?: number
  stdout?: string
  stderr?: string
}

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

function createFailedCommandReport(targetDir: string) {
  const plan = createProjectPlan(parseCreateIntent('React 主应用 + Vue 子应用'), {
    targetDir,
    dryRun: false,
    install: true,
    dev: true,
    verify: true,
    json: false,
  })

  return buildCreateReport(plan, [], [
    {
      name: 'install',
      command: 'pnpm install',
      status: 'failed',
      exitCode: 1,
      stdout: '',
      stderr: 'install failed',
    },
  ])
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
      expect(result.report.commands).toEqual([])
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
        '--skip-verify',
        '--json',
      ])

      const result = JSON.parse(stdout)
      const reportJson = JSON.parse(
        await fs.readFile(path.join(targetDir, 'emp-report.json'), 'utf8'),
      )

      expect(result.report.status).toBe('passed')
      expect(reportJson.status).toBe('passed')
      expect(reportJson.commands).toEqual([
        expect.objectContaining({
          name: 'install',
          command: 'pnpm install',
          status: 'skipped',
        }),
        expect.objectContaining({
          name: 'build',
          command: 'pnpm build',
          status: 'skipped',
        }),
        expect.objectContaining({
          name: 'dev',
          command: 'pnpm dev',
          status: 'skipped',
        }),
      ])
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

  test('marks process failed when create report contains a failed command result', () => {
    const previousExitCode = process.exitCode
    const previousLog = console.log
    const messages: string[] = []
    const reportPath = path.join(os.tmpdir(), 'emp-report.json')

    try {
      process.exitCode = undefined
      console.log = (...args: unknown[]) => {
        messages.push(args.join(' '))
      }

      const report = createFailedCommandReport(path.join(os.tmpdir(), 'failed-command-app'))

      expect(report.status).toBe('failed')

      applyCreateReportExitStatus(report, reportPath, false)

      expect(process.exitCode).toBe(1)
      expect(messages.join('\n')).toMatch(/EMP 新项目创建失败/)
      expect(messages.join('\n')).toContain('失败命令: install - pnpm install')
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
        '--skip-install',
        '--skip-dev',
        '--skip-verify',
        '--json',
      ])

      const result = JSON.parse(stdout)
      const reportJson = JSON.parse(
        await fs.readFile(path.join(targetDir, 'emp-report.json'), 'utf8'),
      )

      expect(result.report.status).toBe('passed')
      expect(result.report.checks).toEqual([])
      expect(result.report.commands).toEqual([
        expect.objectContaining({
          name: 'install',
          command: 'pnpm install',
          status: 'skipped',
        }),
        expect.objectContaining({
          name: 'build',
          command: 'pnpm build',
          status: 'skipped',
        }),
        expect.objectContaining({
          name: 'dev',
          command: 'pnpm dev',
          status: 'skipped',
        }),
      ])
      expect(reportJson.status).toBe('passed')
      expect(reportJson.checks).toEqual([])
    })
  })

  test('prints structured failed report when target directory is not empty', async () => {
    await withTempDir(async tmpRoot => {
      const targetDir = path.join(tmpRoot, 'non-empty-app')
      const existingFile = path.join(targetDir, 'existing.txt')
      const reportPath = path.join(targetDir, 'emp-report.json')

      await fs.mkdir(targetDir, {recursive: true})
      await fs.writeFile(existingFile, 'user-owned content\n', 'utf8')

      let error: ExecFileError | undefined
      try {
        await runCli([
          'create',
          'React 主应用 + Vue 子应用',
          '--dir',
          targetDir,
          '--json',
        ])
      } catch (caught) {
        error = caught as ExecFileError
      }

      expect(error).toBeDefined()
      expect(error?.code).toBe(1)

      const result = JSON.parse(error?.stdout ?? '')
      expect(result.report.status).toBe('failed')
      expect(result.reportPath).toBe(reportPath)
      expect(result.report.checks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({name: 'create', status: 'failed'}),
        ]),
      )

      await expect(fs.readFile(existingFile, 'utf8')).resolves.toBe('user-owned content\n')
      await expect(fs.stat(path.join(targetDir, 'apps/host/emp.config.ts'))).rejects.toThrow(
        /ENOENT/,
      )

      const reportJson = JSON.parse(await fs.readFile(reportPath, 'utf8'))
      expect(reportJson.status).toBe('failed')
    })
  })

  test('prints structured failed JSON for invalid create intent without stack trace', async () => {
    await withTempDir(async tmpRoot => {
      const targetDir = path.join(tmpRoot, 'invalid-intent-app')

      let error: ExecFileError | undefined
      try {
        await runCli(['create', 'React 主应用', '--dir', targetDir, '--json'])
      } catch (caught) {
        error = caught as ExecFileError
      }

      expect(error).toBeDefined()
      expect(error?.code).toBe(1)
      expect(error?.stderr ?? '').not.toMatch(/\n\s+at\s+/)

      const result = JSON.parse(error?.stdout ?? '')
      expect(result.report.status).toBe('failed')
      expect(result.report.checks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({name: 'create', status: 'failed'}),
        ]),
      )
      expect(result.report.rootDir).toBe(targetDir)
      expect(result.reportPath).toBe(path.join(targetDir, 'emp-report.json'))
      await expect(fs.stat(path.join(targetDir, 'apps/host/emp.config.ts'))).rejects.toThrow(
        /ENOENT/,
      )
    })
  })

  test('does not overwrite existing emp-report.json when create fails', async () => {
    await withTempDir(async tmpRoot => {
      const targetDir = path.join(tmpRoot, 'existing-report-app')
      const reportPath = path.join(targetDir, 'emp-report.json')
      const existingReport = '{"status":"passed","rootDir":"user-owned"}\n'

      await fs.mkdir(targetDir, {recursive: true})
      await fs.writeFile(reportPath, existingReport, 'utf8')

      let error: ExecFileError | undefined
      try {
        await runCli([
          'create',
          'React 主应用 + Vue 子应用',
          '--dir',
          targetDir,
          '--json',
        ])
      } catch (caught) {
        error = caught as ExecFileError
      }

      expect(error).toBeDefined()
      expect(error?.code).toBe(1)
      expect(error?.stderr ?? '').not.toMatch(/\n\s+at\s+/)

      const result = JSON.parse(error?.stdout ?? '')
      expect(result.report.status).toBe('failed')
      expect(result.report.checks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({name: 'create', status: 'failed'}),
        ]),
      )
      await expect(fs.readFile(reportPath, 'utf8')).resolves.toBe(existingReport)
    })
  })

  test('includes report write failure when failed report cannot be written', async () => {
    await withTempDir(async tmpRoot => {
      const blockedParent = path.join(tmpRoot, 'blocked-parent')
      const targetDir = path.join(blockedParent, 'child-app')

      await fs.writeFile(blockedParent, 'not a directory\n', 'utf8')

      let error: ExecFileError | undefined
      try {
        await runCli(['create', 'React 主应用', '--dir', targetDir, '--json'])
      } catch (caught) {
        error = caught as ExecFileError
      }

      expect(error).toBeDefined()
      expect(error?.code).toBe(1)
      expect(error?.stderr ?? '').not.toMatch(/\n\s+at\s+/)

      const result = JSON.parse(error?.stdout ?? '')
      expect(result.report.status).toBe('failed')
      expect(result.report.checks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({name: 'create', status: 'failed'}),
          expect.objectContaining({
            name: 'report',
            status: 'failed',
            message: expect.stringContaining('写入失败报告失败'),
          }),
        ]),
      )
      await expect(fs.stat(path.join(targetDir, 'emp-report.json'))).rejects.toThrow()
    })
  })
})
