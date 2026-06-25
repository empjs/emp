import os from 'node:os'
import path from 'node:path'
import {describe, expect, test} from '@rstest/core'
import {
  runCommandForCreate,
  runCreateCommands,
} from '../src/agent-create/executor'
import {parseCreateIntent} from '../src/agent-create/intent'
import {createProjectPlan} from '../src/agent-create/planner'
import type {CreateProjectPlan} from '../src/agent-create/types'

const createPlan = (targetDir: string): CreateProjectPlan =>
  createProjectPlan(parseCreateIntent('React 主应用 + Vue 子应用'), {
    targetDir,
    dryRun: false,
    install: false,
    dev: false,
    verify: false,
    json: true,
  })

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
})
