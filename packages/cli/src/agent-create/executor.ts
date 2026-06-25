import {execFile as execFileCallback, spawn} from 'node:child_process'
import type {ChildProcess} from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {promisify} from 'node:util'
import type {CommandResult, CreateOptions, CreateProjectPlan} from './types'

const execFile = promisify(execFileCallback)
const commandBufferLimit = 1024 * 1024 * 10
const devLogBufferLimit = 1024 * 128

interface CreateCommandInput {
  name: string
  command: string
  args: string[]
  cwd: string
  timeoutMs: number
}

interface StartDevCommandOptions {
  command?: string
  args?: string[]
  startupWindowMs?: number
}

interface CreateCommandRuntime {
  runCommandForCreate?: (input: CreateCommandInput) => Promise<CommandResult>
  startDevCommandForCreate?: (
    plan: Pick<CreateProjectPlan, 'rootDir'>,
    options?: StartDevCommandOptions,
  ) => Promise<CommandResult>
  devCommand?: StartDevCommandOptions
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

function skippedAfterFailure(name: string, command: string, failedCommand: CommandResult): CommandResult {
  return skipped(name, command, `由于前置命令 ${failedCommand.name} 失败，已跳过`)
}

function skippedAfterSkippedInstall(name: string, command: string): CommandResult {
  return skipped(name, command, `由于依赖安装已跳过，已跳过 ${name} 命令`)
}

function readDevLog(filePath: string): string {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return content.length > devLogBufferLimit ? content.slice(-devLogBufferLimit) : content
  } catch {
    return ''
  }
}

function appendDevMessage(output: string, message: string): string {
  return output ? `${output.trimEnd()}\n${message}` : message
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

export async function startDevCommandForCreate(
  plan: Pick<CreateProjectPlan, 'rootDir'>,
  options: StartDevCommandOptions = {},
): Promise<CommandResult> {
  const devCommand = options.command ?? 'pnpm'
  const devArgs = options.args ?? ['dev']
  const startupWindowMs = options.startupWindowMs ?? 1000
  const command = commandText(devCommand, devArgs)
  const logDir = fs.mkdtempSync(path.join(os.tmpdir(), 'emp-create-dev-'))
  const stdoutPath = path.join(logDir, 'stdout.log')
  const stderrPath = path.join(logDir, 'stderr.log')
  const stdoutFd = fs.openSync(stdoutPath, 'a')
  const stderrFd = fs.openSync(stderrPath, 'a')

  let child: ChildProcess

  try {
    child = spawn(devCommand, devArgs, {
      cwd: plan.rootDir,
      detached: true,
      stdio: ['ignore', stdoutFd, stderrFd],
    })
  } catch (error) {
    fs.closeSync(stdoutFd)
    fs.closeSync(stderrFd)
    return {
      name: 'dev',
      command,
      status: 'failed',
      exitCode: null,
      stdout: '',
      stderr: error instanceof Error ? error.message : String(error),
    }
  }
  fs.closeSync(stdoutFd)
  fs.closeSync(stderrFd)

  return new Promise(resolve => {
    let settled = false
    let timer: NodeJS.Timeout

    const cleanup = () => {
      clearTimeout(timer)
      child.off('error', onError)
      child.off('exit', onExit)
    }

    const settle = (result: CommandResult) => {
      if (settled) {
        return
      }

      settled = true
      cleanup()
      resolve(result)
    }

    const onError = (error: Error) => {
      settle({
        name: 'dev',
        command,
        status: 'failed',
        exitCode: null,
        stdout: readDevLog(stdoutPath),
        stderr: appendDevMessage(readDevLog(stderrPath), error.message),
      })
    }

    const onExit = (code: number | null, signal: NodeJS.Signals | null) => {
      const exitMessage = `dev command exited before startup window (code=${code ?? 'null'}, signal=${signal ?? 'null'})`
      settle({
        name: 'dev',
        command,
        status: 'failed',
        exitCode: code,
        stdout: readDevLog(stdoutPath),
        stderr: appendDevMessage(readDevLog(stderrPath), exitMessage),
      })
    }

    child.once('error', onError)
    child.once('exit', onExit)

    timer = setTimeout(() => {
      settle({
        name: 'dev',
        command,
        status: 'passed',
        exitCode: null,
        stdout: appendDevMessage(readDevLog(stdoutPath), `pid=${child.pid}`),
        stderr: readDevLog(stderrPath),
      })
      child.unref()
    }, startupWindowMs)
  })
}

export async function runCreateCommands(
  plan: Pick<CreateProjectPlan, 'rootDir'>,
  options: Pick<CreateOptions, 'install' | 'verify' | 'dev'>,
  runtime: CreateCommandRuntime = {},
): Promise<CommandResult[]> {
  const results: CommandResult[] = []
  const runCommand = runtime.runCommandForCreate ?? runCommandForCreate
  const startDevCommand = runtime.startDevCommandForCreate ?? startDevCommandForCreate

  results.push(
    options.install
      ? await runCommand({
          name: 'install',
          command: 'pnpm',
          args: ['install'],
          cwd: plan.rootDir,
          timeoutMs: 120_000,
        })
      : skipped('install', 'pnpm install', '已通过 --skip-install 跳过'),
  )

  const installResult = results[0]
  if (installResult?.status === 'failed') {
    results.push(skippedAfterFailure('build', 'pnpm build', installResult))
    results.push(skippedAfterFailure('dev', 'pnpm dev', installResult))
    return results
  }

  if (installResult?.status === 'skipped') {
    results.push(
      options.verify
        ? skipped(
            'build',
            'pnpm build',
            '由于依赖安装已跳过，已跳过 build 命令；静态 verify 仍会执行',
          )
        : skipped('build', 'pnpm build', '已通过 --skip-verify 跳过'),
    )
    results.push(
      options.dev
        ? skippedAfterSkippedInstall('dev', 'pnpm dev')
        : skipped('dev', 'pnpm dev', '已通过 --skip-dev 跳过'),
    )
    return results
  }

  results.push(
    options.verify
      ? await runCommand({
          name: 'build',
          command: 'pnpm',
          args: ['build'],
          cwd: plan.rootDir,
          timeoutMs: 120_000,
        })
      : skipped('build', 'pnpm build', '已通过 --skip-verify 跳过'),
  )

  const buildResult = results[1]
  if (buildResult?.status === 'failed') {
    results.push(skippedAfterFailure('dev', 'pnpm dev', buildResult))
    return results
  }

  results.push(
    options.dev
      ? await startDevCommand(plan, runtime.devCommand)
      : skipped('dev', 'pnpm dev', '已通过 --skip-dev 跳过'),
  )

  return results
}
