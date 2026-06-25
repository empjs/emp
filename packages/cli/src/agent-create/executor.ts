import {execFile as execFileCallback, spawn} from 'node:child_process'
import {promisify} from 'node:util'
import type {CommandResult, CreateOptions, CreateProjectPlan} from './types'

const execFile = promisify(execFileCallback)
const commandBufferLimit = 1024 * 1024 * 10

interface CreateCommandInput {
  name: string
  command: string
  args: string[]
  cwd: string
  timeoutMs: number
}

interface ExecFileFailure extends Error {
  code?: number | string
  stdout?: string | Buffer
  stderr?: string | Buffer
}

function commandText(command: string, args: string[]): string {
  return [command, ...args].join(' ')
}

function outputText(output: string | Buffer | undefined): string {
  return output?.toString() ?? ''
}

function exitCode(error: ExecFileFailure): number | null {
  return typeof error.code === 'number' ? error.code : null
}

function skipped(name: string, command: string, reason: string): CommandResult {
  return {
    name,
    command,
    status: 'skipped',
    exitCode: null,
    stdout: '',
    stderr: reason,
  }
}

export async function runCommandForCreate(input: CreateCommandInput): Promise<CommandResult> {
  const command = commandText(input.command, input.args)

  try {
    const {stdout, stderr} = await execFile(input.command, input.args, {
      cwd: input.cwd,
      timeout: input.timeoutMs,
      maxBuffer: commandBufferLimit,
    })

    return {
      name: input.name,
      command,
      status: 'passed',
      exitCode: 0,
      stdout,
      stderr,
    }
  } catch (error) {
    const failure = error as ExecFileFailure

    return {
      name: input.name,
      command,
      status: 'failed',
      exitCode: exitCode(failure),
      stdout: outputText(failure.stdout),
      stderr: outputText(failure.stderr) || failure.message,
    }
  }
}

export function startDevCommandForCreate(
  plan: Pick<CreateProjectPlan, 'rootDir'>,
): CommandResult {
  const child = spawn('pnpm', ['dev'], {
    cwd: plan.rootDir,
    detached: true,
    stdio: 'ignore',
  })
  child.unref()

  return {
    name: 'dev',
    command: 'pnpm dev',
    status: 'passed',
    exitCode: null,
    stdout: `pid=${child.pid}`,
    stderr: '',
  }
}

export async function runCreateCommands(
  plan: Pick<CreateProjectPlan, 'rootDir'>,
  options: Pick<CreateOptions, 'install' | 'verify' | 'dev'>,
): Promise<CommandResult[]> {
  const results: CommandResult[] = []

  results.push(
    options.install
      ? await runCommandForCreate({
          name: 'install',
          command: 'pnpm',
          args: ['install'],
          cwd: plan.rootDir,
          timeoutMs: 120_000,
        })
      : skipped('install', 'pnpm install', '已通过 --skip-install 跳过'),
  )

  results.push(
    options.verify
      ? await runCommandForCreate({
          name: 'build',
          command: 'pnpm',
          args: ['build'],
          cwd: plan.rootDir,
          timeoutMs: 120_000,
        })
      : skipped('build', 'pnpm build', '已通过 --skip-verify 跳过'),
  )

  results.push(
    options.dev
      ? startDevCommandForCreate(plan)
      : skipped('dev', 'pnpm dev', '已通过 --skip-dev 跳过'),
  )

  return results
}
