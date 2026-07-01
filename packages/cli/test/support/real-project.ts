import {spawn, type ChildProcessWithoutNullStreams} from 'node:child_process'
import {promises as fs} from 'node:fs'
import net from 'node:net'
import {tmpdir} from 'node:os'
import {dirname, join, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

export type CommandResult = {
  code: number | null
  stdout: string
  stderr: string
}

export type SpawnedCommand = {
  child: ChildProcessWithoutNullStreams
  output: () => {stdout: string; stderr: string}
  stop: (signal?: NodeJS.Signals) => Promise<void>
}

const cliTestDir = dirname(fileURLToPath(import.meta.url))
export const repoRoot = resolve(cliTestDir, '../../../..')
export const cliBin = join(repoRoot, 'packages/cli/bin/emp.js')

export async function createRealProject(prefix: string) {
  const root = await fs.mkdtemp(join(tmpdir(), `emp-${prefix}-`))
  return {
    root,
    path: (...segments: string[]) => join(root, ...segments),
    cleanup: () => fs.rm(root, {recursive: true, force: true}),
  }
}

export async function writeProjectFile(root: string, file: string, content: string) {
  const target = join(root, file)
  await fs.mkdir(dirname(target), {recursive: true})
  await fs.writeFile(target, content)
}

export async function readProjectFile(root: string, file: string) {
  return fs.readFile(join(root, file), 'utf8')
}

export async function pathExists(path: string) {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

async function getCliDistSnapshot() {
  const requiredFiles = [
    join(repoRoot, 'packages/cli/dist/index.js'),
    join(repoRoot, 'packages/cli/dist/static.js'),
    join(repoRoot, 'packages/cli/dist/serve.js'),
    join(repoRoot, 'packages/cli/dist/build.js'),
    join(repoRoot, 'packages/cli/dist/server.js'),
  ]
  try {
    const stats = await Promise.all(requiredFiles.map(file => fs.stat(file)))
    return stats.map(stat => stat.mtimeMs).join(':')
  } catch {
    return null
  }
}

async function newestMtime(root: string) {
  const entries = await fs.readdir(root, {withFileTypes: true})
  if (entries.length === 0) return 0
  const mtimes = await Promise.all(
    entries.map(async entry => {
      const target = join(root, entry.name)
      if (entry.isDirectory()) return newestMtime(target)
      return (await fs.stat(target)).mtimeMs
    }),
  )
  return Math.max(...mtimes)
}

async function assertCliDistFresh() {
  const srcMtime = await newestMtime(join(repoRoot, 'packages/cli/src'))
  const distMtime = await newestMtime(join(repoRoot, 'packages/cli/dist'))
  if (distMtime < srcMtime) {
    throw new Error('packages/cli/dist is older than packages/cli/src; run corepack pnpm --filter @empjs/cli build before real CLI tests')
  }
}

export async function waitForCliDistReady(timeoutMs = 30000) {
  const startedAt = Date.now()
  let lastSnapshot = ''
  while (Date.now() - startedAt < timeoutMs) {
    const snapshot = await getCliDistSnapshot()
    if (snapshot && snapshot === lastSnapshot) {
      await assertCliDistFresh()
      return
    }
    lastSnapshot = snapshot ?? ''
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  throw new Error('Timed out waiting for @empjs/cli dist artifacts to settle')
}

export async function listFiles(root: string, relativeDir = '') {
  const dir = join(root, relativeDir)
  const entries = await fs.readdir(dir, {withFileTypes: true})
  const files: string[] = []
  for (const entry of entries) {
    const nextRelative = join(relativeDir, entry.name)
    const nextPath = join(root, nextRelative)
    if (entry.isDirectory()) {
      files.push(...(await listFiles(root, nextRelative)))
      continue
    }
    const stat = await fs.stat(nextPath)
    if (stat.isFile()) files.push(nextRelative)
  }
  return files.sort()
}

export async function findFreePort(host = '127.0.0.1') {
  return await new Promise<number>((resolvePort, rejectPort) => {
    const server = net.createServer()
    server.on('error', rejectPort)
    server.listen(0, host, () => {
      const address = server.address()
      if (!address || typeof address === 'string') {
        server.close(() => rejectPort(new Error('Unable to determine a free port')))
        return
      }
      const {port} = address
      server.close(() => resolvePort(port))
    })
  })
}

export async function waitForPortReleased(port: number, host = '127.0.0.1', timeoutMs = 10000) {
  const startedAt = Date.now()
  let lastError: unknown
  while (Date.now() - startedAt < timeoutMs) {
    const released = await new Promise<boolean>(resolvePort => {
      const server = net.createServer()
      server.once('error', error => {
        lastError = error
        resolvePort(false)
      })
      server.listen(port, host, () => {
        server.close(() => resolvePort(true))
      })
    })
    if (released) return
    await new Promise(resolveWait => setTimeout(resolveWait, 250))
  }
  throw lastError instanceof Error ? lastError : new Error(`Timed out waiting for port ${port} to be released`)
}

export function runCommand(command: string, args: string[], cwd: string, timeoutMs = 120000) {
  return new Promise<CommandResult>((resolveResult, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: {...process.env, FORCE_COLOR: '0'},
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let stdout = ''
    let stderr = ''
    const timer = setTimeout(() => {
      child.kill('SIGTERM')
      reject(new Error(`Command timed out after ${timeoutMs}ms: ${command} ${args.join(' ')}`))
    }, timeoutMs)
    child.stdout.on('data', chunk => {
      stdout += chunk
    })
    child.stderr.on('data', chunk => {
      stderr += chunk
    })
    child.on('error', error => {
      clearTimeout(timer)
      reject(error)
    })
    child.on('close', code => {
      clearTimeout(timer)
      resolveResult({code, stdout, stderr})
    })
  })
}

export function runCli(args: string[], cwd: string, timeoutMs?: number) {
  return waitForCliDistReady().then(() => runCommand(process.execPath, [cliBin, ...args], cwd, timeoutMs))
}

export function spawnCommand(command: string, args: string[], cwd: string): SpawnedCommand {
  const child = spawn(command, args, {
    cwd,
    env: {...process.env, FORCE_COLOR: '0'},
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let stdout = ''
  let stderr = ''
  child.stdout.on('data', chunk => {
    stdout += chunk
  })
  child.stderr.on('data', chunk => {
    stderr += chunk
  })
  return {
    child,
    output: () => ({stdout, stderr}),
    stop: async (signal = 'SIGTERM') => {
      if (child.exitCode !== null || child.signalCode !== null) return
      await new Promise<void>(resolveStop => {
        child.once('close', () => resolveStop())
        child.kill(signal)
        setTimeout(() => {
          if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL')
        }, 5000).unref()
      })
    },
  }
}

export async function spawnCli(args: string[], cwd: string) {
  await waitForCliDistReady()
  return spawnCommand(process.execPath, [cliBin, ...args], cwd)
}

export async function waitForHttp(url: string, timeoutMs = 60000) {
  const startedAt = Date.now()
  let lastError: unknown
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.ok) return response
      lastError = new Error(`HTTP ${response.status} from ${url}`)
    } catch (error) {
      lastError = error
    }
    await new Promise(resolveWait => setTimeout(resolveWait, 250))
  }
  throw lastError instanceof Error ? lastError : new Error(`Timed out waiting for ${url}`)
}
