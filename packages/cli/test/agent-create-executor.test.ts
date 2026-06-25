import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {describe, expect, test} from '@rstest/core'
import {
  runCommandForCreate,
  runCreateCommands,
  startDevCommandForCreate,
} from '../src/agent-create/executor'
import {parseCreateIntent} from '../src/agent-create/intent'
import {createProjectPlan} from '../src/agent-create/planner'
import type {CommandResult, CreateProjectPlan} from '../src/agent-create/types'

const createPlan = (targetDir: string): CreateProjectPlan =>
  createProjectPlan(parseCreateIntent('React 主应用 + Vue 子应用'), {
    targetDir,
    dryRun: false,
    install: false,
    dev: false,
    verify: false,
    json: true,
  })

async function withTempDir<T>(callback: (tmpRoot: string) => Promise<T>): Promise<T> {
  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'emp-agent-executor-'))
  try {
    return await callback(tmpRoot)
  } finally {
    await fs.rm(tmpRoot, {recursive: true, force: true})
  }
}

describe('agent-create command executor', () => {
  test('returns skipped install build and dev command results when all commands are disabled', async () => {
    const plan = createPlan(path.join(os.tmpdir(), 'emp-agent-executor-skipped'))

    const results = await runCreateCommands(plan, {
      install: false,
      verify: false,
      dev: false,
    })

    expect(results).toEqual([
      {
        name: 'install',
        command: 'pnpm install',
        status: 'skipped',
        exitCode: null,
        stdout: '',
        stderr: '已通过 --skip-install 跳过',
      },
      {
        name: 'build',
        command: 'pnpm build',
        status: 'skipped',
        exitCode: null,
        stdout: '',
        stderr: '已通过 --skip-verify 跳过',
      },
      {
        name: 'dev',
        command: 'pnpm dev',
        status: 'skipped',
        exitCode: null,
        stdout: '',
        stderr: '已通过 --skip-dev 跳过',
      },
    ])
  })

  test('returns passed command result for a successful node command', async () => {
    const result = await runCommandForCreate({
      name: 'node-version',
      command: process.execPath,
      args: ['--version'],
      cwd: process.cwd(),
      timeoutMs: 10_000,
    })

    expect(result.name).toBe('node-version')
    expect(result.command).toBe(`${process.execPath} --version`)
    expect(result.status).toBe('passed')
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toMatch(/^v/)
  })

  test('returns failed command result with consumable output when a command exits non-zero', async () => {
    const result = await runCommandForCreate({
      name: 'node-failure',
      command: process.execPath,
      args: [
        '-e',
        "process.stdout.write('visible stdout'); process.stderr.write('visible stderr'); process.exit(7)",
      ],
      cwd: process.cwd(),
      timeoutMs: 10_000,
    })

    expect(result.name).toBe('node-failure')
    expect(result.status).toBe('failed')
    expect(result.exitCode).toBe(7)
    expect(result.stdout).toContain('visible stdout')
    expect(result.stderr).toContain('visible stderr')
  })

  test('returns failed dev result when the dev process exits during startup window', async () => {
    await withTempDir(async tmpRoot => {
      const result = await startDevCommandForCreate(
        {rootDir: tmpRoot},
        {
          command: process.execPath,
          args: ['-e', 'process.exit(7)'],
          startupWindowMs: 50,
        },
      )

      expect(result.name).toBe('dev')
      expect(result.command).toBe(`${process.execPath} -e process.exit(7)`)
      expect(result.status).toBe('failed')
      expect(result.exitCode).toBe(7)
      expect(result.stderr).toMatch(/exited before startup window/)
    })
  })

  test('captures dev stdout and stderr when the dev process exits during startup window', async () => {
    await withTempDir(async tmpRoot => {
      const result = await startDevCommandForCreate(
        {rootDir: tmpRoot},
        {
          command: process.execPath,
          args: [
            '-e',
            "process.stdout.write('visible stdout\\n'); process.stderr.write('visible stderr\\n'); setTimeout(() => process.exit(7), 20)",
          ],
          startupWindowMs: 200,
        },
      )

      expect(result.status).toBe('failed')
      expect(result.exitCode).toBe(7)
      expect(result.stdout).toContain('visible stdout')
      expect(result.stderr).toContain('visible stderr')
      expect(result.stderr).toMatch(/exited before startup window/)
    })
  })

  test('returns failed dev result when the dev command emits an error', async () => {
    await withTempDir(async tmpRoot => {
      const missingCommand = `emp-agent-create-missing-dev-command-${Date.now()}`

      const result = await startDevCommandForCreate(
        {rootDir: tmpRoot},
        {
          command: missingCommand,
          args: ['dev'],
          startupWindowMs: 500,
        },
      )

      expect(result.name).toBe('dev')
      expect(result.command).toBe(`${missingCommand} dev`)
      expect(result.status).toBe('failed')
      expect(result.exitCode).toBe(null)
      expect(result.stderr).toMatch(/ENOENT|not found|spawn/)
    })
  })

  test('skips build and dev when install command fails', async () => {
    const calls: string[] = []
    const failedInstall: CommandResult = {
      name: 'install',
      command: 'pnpm install',
      status: 'failed',
      exitCode: 1,
      stdout: '',
      stderr: 'install failed',
    }

    const results = await runCreateCommands(
      {rootDir: process.cwd()},
      {install: true, verify: true, dev: true},
      {
        runCommandForCreate: async input => {
          calls.push(input.name)
          return failedInstall
        },
        startDevCommandForCreate: async () => {
          calls.push('dev')
          return {
            name: 'dev',
            command: 'pnpm dev',
            status: 'passed',
            exitCode: null,
            stdout: 'pid=1',
            stderr: '',
          }
        },
      },
    )

    expect(calls).toEqual(['install'])
    expect(results).toEqual([
      failedInstall,
      {
        name: 'build',
        command: 'pnpm build',
        status: 'skipped',
        exitCode: null,
        stdout: '',
        stderr: '由于前置命令 install 失败，已跳过',
      },
      {
        name: 'dev',
        command: 'pnpm dev',
        status: 'skipped',
        exitCode: null,
        stdout: '',
        stderr: '由于前置命令 install 失败，已跳过',
      },
    ])
  })

  test('skips build when install was intentionally skipped even if verify remains enabled', async () => {
    const calls: string[] = []

    const results = await runCreateCommands(
      {rootDir: process.cwd()},
      {install: false, verify: true, dev: false},
      {
        runCommandForCreate: async input => {
          calls.push(input.name)
          return {
            name: input.name,
            command: `${input.command} ${input.args.join(' ')}`,
            status: 'passed',
            exitCode: 0,
            stdout: `${input.name} should not run`,
            stderr: '',
          }
        },
      },
    )

    expect(calls).toEqual([])
    expect(results).toEqual([
      {
        name: 'install',
        command: 'pnpm install',
        status: 'skipped',
        exitCode: null,
        stdout: '',
        stderr: '已通过 --skip-install 跳过',
      },
      {
        name: 'build',
        command: 'pnpm build',
        status: 'skipped',
        exitCode: null,
        stdout: '',
        stderr: '由于依赖安装已跳过，已跳过 build 命令；静态 verify 仍会执行',
      },
      {
        name: 'dev',
        command: 'pnpm dev',
        status: 'skipped',
        exitCode: null,
        stdout: '',
        stderr: '已通过 --skip-dev 跳过',
      },
    ])
  })

  test('skips dev and does not start dev command when build command fails', async () => {
    const calls: string[] = []
    const passedInstall: CommandResult = {
      name: 'install',
      command: 'pnpm install',
      status: 'passed',
      exitCode: 0,
      stdout: 'install ok',
      stderr: '',
    }
    const failedBuild: CommandResult = {
      name: 'build',
      command: 'pnpm build',
      status: 'failed',
      exitCode: 1,
      stdout: '',
      stderr: 'build failed',
    }

    const results = await runCreateCommands(
      {rootDir: process.cwd()},
      {install: true, verify: true, dev: true},
      {
        runCommandForCreate: async input => {
          calls.push(input.name)
          return input.name === 'install' ? passedInstall : failedBuild
        },
        startDevCommandForCreate: async () => {
          calls.push('dev')
          throw new Error('dev command should not start after build failure')
        },
      },
    )

    expect(calls).toEqual(['install', 'build'])
    expect(results).toEqual([
      passedInstall,
      failedBuild,
      {
        name: 'dev',
        command: 'pnpm dev',
        status: 'skipped',
        exitCode: null,
        stdout: '',
        stderr: '由于前置命令 build 失败，已跳过',
      },
    ])
  })
})
