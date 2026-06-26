import fs from 'node:fs/promises'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'
import {execFile as execFileCallback} from 'node:child_process'
import {promisify} from 'node:util'
import {beforeAll, describe, expect, test} from '@rstest/core'
import {buildCreateReport} from '../src/agent-create/report'
import {parseCreateIntent} from '../src/agent-create/intent'
import {createProjectPlan} from '../src/agent-create/planner'
import {applyCreateReportExitStatus, runCreateCommand} from '../src/script/create'

const execFile = promisify(execFileCallback)
const repoRoot = path.resolve(import.meta.dirname, '../../..')
const cliPath = path.join(repoRoot, 'packages/cli/bin/emp.js')

interface ExecFileError extends Error {
  code?: number
  stdout?: string
  stderr?: string
}

interface RunCliOptions {
  cwd?: string
  env?: NodeJS.ProcessEnv
  timeout?: number
}

async function runCli(args: string[], options: RunCliOptions = {}) {
  return execFile(process.execPath, [cliPath, ...args], {
    cwd: options.cwd ?? repoRoot,
    env: options.env ?? process.env,
    timeout: options.timeout,
    maxBuffer: 1024 * 1024 * 10,
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

async function listenOnPort(port: number): Promise<net.Server> {
  const server = net.createServer()

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, () => {
      server.off('error', reject)
      resolve()
    })
  })

  return server
}

async function closeServer(server: net.Server): Promise<void> {
  await new Promise<void>(resolve => {
    server.close(() => resolve())
  })
}

function killDevProcess(stdout: string): void {
  const result = JSON.parse(stdout)
  const devCommand = result.report.commands.find((command: {name: string}) => command.name === 'dev')
  const pidMatch = /pid=(\d+)/.exec(devCommand?.stdout ?? '')

  if (!pidMatch) {
    return
  }

  const pid = Number(pidMatch[1])
  try {
    process.kill(-pid, 'SIGTERM')
  } catch {
    try {
      process.kill(pid, 'SIGTERM')
    } catch {}
  }
}

interface FakePnpmOptions {
  buildScript?: string
}

async function createFakePnpmBin(
  tmpRoot: string,
  options: FakePnpmOptions = {},
): Promise<string> {
  const binDir = path.join(tmpRoot, 'bin')
  const pnpmPath = path.join(binDir, 'pnpm')
  const script = `#!/usr/bin/env node
const fs = require('node:fs')
const http = require('node:http')
const path = require('node:path')
const command = process.argv[2]
if (command === 'install') {
  process.stdout.write('fake install ok\\n')
  process.exit(0)
}
if (command === 'build') {
  ${options.buildScript ?? ''}
  process.stdout.write('fake build ok\\n')
  process.exit(0)
}
if (command === 'dev') {
  const intentYaml = fs.readFileSync(path.join(process.cwd(), 'emp.intent.yaml'), 'utf8')
  const hostMatch = /role: host[\\s\\S]*?port: (\\d+)/.exec(intentYaml)
  const remoteMatch = /role: remote[\\s\\S]*?port: (\\d+)/.exec(intentYaml)
  const hostPort = Number(hostMatch && hostMatch[1])
  const remotePort = Number(remoteMatch && remoteMatch[1])
  if (!hostPort || !remotePort) {
    process.stderr.write('fake dev could not read planned ports\\n')
    process.exit(1)
  }
  http
    .createServer((request, response) => {
      response.writeHead(200, {'content-type': 'text/html'})
      response.end('<main>fake host ready</main>')
    })
    .listen(hostPort, '127.0.0.1')
  http
    .createServer((request, response) => {
      if (request.url && request.url.startsWith('/emp.js')) {
        response.writeHead(200, {'content-type': 'application/javascript'})
        response.end('globalThis.__EMP_FAKE_REMOTE__ = true;')
        return
      }
      response.writeHead(404, {'content-type': 'text/plain'})
      response.end('not found')
    })
    .listen(remotePort, '127.0.0.1')
  process.stdout.write('fake dev ready host=' + hostPort + ' remote=' + remotePort + '\\n')
  setInterval(() => {}, 1000)
} else {
  process.stderr.write('unsupported fake pnpm command: ' + process.argv.slice(2).join(' ') + '\\n')
  process.exit(1)
}
`

  await fs.mkdir(binDir, {recursive: true})
  await fs.writeFile(pnpmPath, script, 'utf8')
  await fs.chmod(pnpmPath, 0o755)

  return binDir
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
    await execFile('corepack', ['pnpm', '--filter', '@empjs/cli', 'build'], {
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

  test('documents passed status as no failed executed steps rather than all steps executed', async () => {
    const docs = await fs.readFile(
      path.join(repoRoot, 'packages/cli/docs/agent-first-create.md'),
      'utf8',
    )

    expect(docs).toContain('没有失败的已执行步骤')
    expect(docs).toContain('不代表对应检查或命令已经执行通过')
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

  test('runs static verification and passes when install and dev are skipped in JSON mode', async () => {
    await withTempDir(async tmpRoot => {
      const targetDir = path.join(tmpRoot, 'static-verify-app')

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
      expect(result.report.checks).not.toEqual([])
      expect(result.report.checks.every((check: {status: string}) => check.status === 'passed')).toBe(
        true,
      )
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
      expect(reportJson.checks).toEqual(result.report.checks)
      expect(reportJson.commands).toEqual(result.report.commands)
    })
  })

  test('chooses available ports before writing the default dev create flow', async () => {
    await withTempDir(async tmpRoot => {
      const targetDir = path.join(tmpRoot, 'port-aware-app')
      const fakePnpmBin = await createFakePnpmBin(tmpRoot)
      const occupiedServers = await Promise.all([listenOnPort(3000), listenOnPort(3001)])
      let stdout = ''

      try {
        const result = await runCli(
          ['create', 'React 主应用 + Vue 子应用', '--dir', targetDir, '--json'],
          {
            env: {
              ...process.env,
              PATH: `${fakePnpmBin}${path.delimiter}${process.env.PATH ?? ''}`,
            },
            timeout: 10_000,
          },
        )
        stdout = result.stdout
        const output = JSON.parse(stdout)
        const reportJson = JSON.parse(
          await fs.readFile(path.join(targetDir, 'emp-report.json'), 'utf8'),
        )
        const hostApp = output.plan.apps.find((app: {role: string}) => app.role === 'host')
        const remoteApp = output.plan.apps.find((app: {role: string}) => app.role === 'remote')
        const hostConfig = await fs.readFile(path.join(targetDir, 'apps/host/emp.config.ts'), 'utf8')
        const remoteConfig = await fs.readFile(path.join(targetDir, 'apps/user/emp.config.ts'), 'utf8')
        const intentYaml = await fs.readFile(path.join(targetDir, 'emp.intent.yaml'), 'utf8')

        expect(output.report.status).toBe('passed')
        expect(hostApp.port).not.toBe(3000)
        expect(remoteApp.port).not.toBe(3001)
        expect(remoteApp.port).not.toBe(hostApp.port)
        expect(hostConfig).toContain(`server: {port: ${hostApp.port}}`)
        expect(hostConfig).toContain(`user@http://localhost:${remoteApp.port}/emp.js`)
        expect(hostConfig).not.toContain('user@http://localhost:3001/emp.js')
        expect(remoteConfig).toContain(`server: {port: ${remoteApp.port}}`)
        expect(intentYaml).toContain(`port: ${hostApp.port}`)
        expect(intentYaml).toContain(`port: ${remoteApp.port}`)
        expect(output.report.apps).toEqual([
          expect.objectContaining({role: 'host', url: `http://localhost:${hostApp.port}`}),
          expect.objectContaining({role: 'remote', url: `http://localhost:${remoteApp.port}`}),
        ])
        expect(reportJson.apps).toEqual(output.report.apps)
      } finally {
        if (stdout) {
          killDevProcess(stdout)
        }
        await Promise.all(occupiedServers.map(closeServer))
      }
    })
  }, 30_000)

  test('preserves command results when static verification throws after commands ran', async () => {
    await withTempDir(async tmpRoot => {
      const targetDir = path.join(tmpRoot, 'verify-throws-app')
      const fakePnpmBin = await createFakePnpmBin(tmpRoot, {
        buildScript:
          "fs.rmSync(path.join(process.cwd(), 'pnpm-workspace.yaml'), {force: true}); fs.mkdirSync(path.join(process.cwd(), 'pnpm-workspace.yaml'));",
      })

      let error: ExecFileError | undefined
      try {
        await runCli(
          [
            'create',
            'React 主应用 + Vue 子应用',
            '--dir',
            targetDir,
            '--skip-dev',
            '--json',
          ],
          {
            env: {
              ...process.env,
              PATH: `${fakePnpmBin}${path.delimiter}${process.env.PATH ?? ''}`,
            },
            timeout: 10_000,
          },
        )
      } catch (caught) {
        error = caught as ExecFileError
      }

      expect(error).toBeDefined()
      expect(error?.code).toBe(1)

      const result = JSON.parse(error?.stdout ?? '')
      const reportJson = JSON.parse(
        await fs.readFile(path.join(targetDir, 'emp-report.json'), 'utf8'),
      )

      expect(result.report.status).toBe('failed')
      expect(result.report.commands).toEqual([
        expect.objectContaining({name: 'install', command: 'pnpm install', status: 'passed'}),
        expect.objectContaining({name: 'build', command: 'pnpm build', status: 'passed'}),
        expect.objectContaining({name: 'dev', command: 'pnpm dev', status: 'skipped'}),
      ])
      expect(result.report.checks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'verify',
            status: 'failed',
            message: expect.stringMatching(/EISDIR|illegal operation|directory/i),
          }),
        ]),
      )
      expect(reportJson.commands).toEqual(result.report.commands)
      expect(reportJson.checks).toEqual(result.report.checks)
    })
  })

  test('preserves checks and command results when report writing fails after verification', async () => {
    await withTempDir(async tmpRoot => {
      const targetDir = path.join(tmpRoot, 'report-write-fails-app')
      const fakePnpmBin = await createFakePnpmBin(tmpRoot, {
        buildScript: "fs.mkdirSync(path.join(process.cwd(), 'emp-report.json'));",
      })
      const reportPath = path.join(targetDir, 'emp-report.json')

      let error: ExecFileError | undefined
      try {
        await runCli(
          [
            'create',
            'React 主应用 + Vue 子应用',
            '--dir',
            targetDir,
            '--skip-dev',
            '--json',
          ],
          {
            env: {
              ...process.env,
              PATH: `${fakePnpmBin}${path.delimiter}${process.env.PATH ?? ''}`,
            },
            timeout: 10_000,
          },
        )
      } catch (caught) {
        error = caught as ExecFileError
      }

      expect(error).toBeDefined()
      expect(error?.code).toBe(1)

      const result = JSON.parse(error?.stdout ?? '')
      const reportPathStat = await fs.stat(reportPath)

      expect(reportPathStat.isDirectory()).toBe(true)
      expect(result.report.status).toBe('failed')
      expect(result.report.commands).toEqual([
        expect.objectContaining({name: 'install', command: 'pnpm install', status: 'passed'}),
        expect.objectContaining({name: 'build', command: 'pnpm build', status: 'passed'}),
        expect.objectContaining({name: 'dev', command: 'pnpm dev', status: 'skipped'}),
      ])
      expect(result.report.checks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({name: 'root-package', status: 'passed'}),
          expect.objectContaining({name: 'workspace', status: 'passed'}),
          expect.objectContaining({name: 'intent', status: 'passed'}),
          expect.objectContaining({name: 'host-config', status: 'passed'}),
          expect.objectContaining({name: 'remote-config', status: 'passed'}),
          expect.objectContaining({
            name: 'report',
            status: 'failed',
            message: expect.stringContaining('写入创建报告失败'),
          }),
        ]),
      )
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

  test('writes fallback failed report through a temporary file before publishing final path', async () => {
    await withTempDir(async tmpRoot => {
      const targetDir = path.join(tmpRoot, 'fallback-atomic-app')
      const reportPath = path.join(targetDir, 'emp-report.json')
      const originalWriteFile = fs.writeFile
      const previousExitCode = process.exitCode
      const previousLog = console.log
      const writeTargets: string[] = []
      const directFinalWrites: string[] = []

      try {
        process.exitCode = undefined
        console.log = () => {}
        fs.writeFile = (async (...args: Parameters<typeof fs.writeFile>) => {
          const [file] = args
          const filePath =
            typeof file === 'string'
              ? file
              : file instanceof URL
                ? file.pathname
                : Buffer.isBuffer(file)
                  ? file.toString()
                  : undefined

          if (filePath) {
            const absoluteFilePath = path.resolve(filePath)
            writeTargets.push(absoluteFilePath)

            if (absoluteFilePath === reportPath) {
              directFinalWrites.push(absoluteFilePath)
              throw new Error('direct final report write blocked')
            }
          }

          return originalWriteFile(...args)
        }) as typeof fs.writeFile

        await runCreateCommand('React 主应用', {dir: targetDir, json: true})

        expect(process.exitCode).toBe(1)
        expect(directFinalWrites).toEqual([])
        expect(writeTargets).toEqual(
          expect.arrayContaining([
            expect.stringMatching(/emp-report\.json\..+\.tmp$/),
          ]),
        )

        const reportJson = JSON.parse(await fs.readFile(reportPath, 'utf8'))
        expect(reportJson.status).toBe('failed')
        expect(reportJson.checks).toEqual(
          expect.arrayContaining([
            expect.objectContaining({name: 'create', status: 'failed'}),
          ]),
        )
      } finally {
        fs.writeFile = originalWriteFile
        console.log = previousLog
        process.exitCode = previousExitCode
      }
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
