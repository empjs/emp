import {spawn} from 'node:child_process'
import {fileURLToPath} from 'node:url'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const localhost = '127.0.0.1'
const children = new Set()
const startedServiceNames = new Set()
const allowExistingServices = process.env.APPS_BROWSER_REUSE_SERVICES === 'true'
const startedServicesEnvKey = 'APPS_BROWSER_STARTED_SERVICES'

export const APP_BROWSER_PROXY_TARGETS = Object.freeze({
  'adapter-host': `http://${localhost}:7701/`,
  demo: `http://${localhost}:8000/`,
  'mf-app': `http://${localhost}:6002/`,
  'mf-host': `http://${localhost}:6001/`,
  'react-19-tanstack': `http://${localhost}:1992/`,
  'rspack2-optimization': `http://${localhost}:8102/`,
  'tailwind-4': `http://${localhost}:8104/`,
  'vue-2-base': `http://${localhost}:9001/`,
  'vue-2-project': `http://${localhost}:9002/`,
  'vue-3-base': `http://${localhost}:9301/`,
  'vue-3-project': `http://${localhost}:9302/`,
})

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

function spawnChild(name, cmd, args, env = {}) {
  console.log(`$ ${[cmd, ...args].join(' ')}`)
  const child = spawn(cmd, args, {
    cwd: repoRoot,
    detached: true,
    env: {...process.env, FORCE_COLOR: '0', ...env},
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  child.stdout.on('data', chunk => process.stdout.write(`[${name}] ${chunk}`))
  child.stderr.on('data', chunk => process.stderr.write(`[${name}] ${chunk}`))
  children.add(child)
  startedServiceNames.add(name)
  process.env[startedServicesEnvKey] = 'true'
  return child
}

async function stopChild(child) {
  if (!child.pid || child.exitCode !== null) return
  killChild(child, 'SIGTERM')
  await Promise.race([new Promise(resolve => child.once('exit', resolve)), sleep(3000)])
  if (child.exitCode === null) killChild(child, 'SIGKILL')
}

function killChild(child, signal) {
  if (!child.pid || child.exitCode !== null) return
  try {
    process.kill(-child.pid, signal)
  } catch {
    child.kill(signal)
  }
}

export async function cleanupAppsBrowserServices() {
  await Promise.all([...children].map(stopChild))
  children.clear()
  startedServiceNames.clear()
  delete process.env[startedServicesEnvKey]
}

export function cleanupAppsBrowserServicesNow() {
  for (const child of children) killChild(child, 'SIGTERM')
  children.clear()
  startedServiceNames.clear()
  delete process.env[startedServicesEnvKey]
}

async function isHttpReady(url) {
  try {
    const response = await fetch(url)
    return response.ok
  } catch {
    return false
  }
}

async function waitForHttp(url, timeoutMs = 90000) {
  const startedAt = Date.now()
  let lastError
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.ok) return
      lastError = new Error(`${url} returned ${response.status}`)
    } catch (error) {
      lastError = error
    }
    await sleep(500)
  }
  throw new Error(`Timed out waiting for ${url}: ${lastError instanceof Error ? lastError.message : String(lastError)}`)
}

async function run(cmd, args, env = {}) {
  console.log(`$ ${[cmd, ...args].join(' ')}`)
  const child = spawn(cmd, args, {
    cwd: repoRoot,
    env: {...process.env, FORCE_COLOR: '0', ...env},
    stdio: 'inherit',
  })
  await new Promise((resolve, reject) => {
    child.on('error', reject)
    child.on('exit', code => {
      if (code === 0) resolve()
      else reject(new Error(`${cmd} ${args.join(' ')} failed with exit code ${code ?? 1}`))
    })
  })
}

async function ensureService(service) {
  if (await isHttpReady(service.readyUrl)) {
    if (startedServiceNames.has(service.name) || process.env[startedServicesEnvKey] === 'true') {
      console.log(`[${service.name}] Reusing service started by this process at ${service.readyUrl}`)
      return
    }
    if (allowExistingServices) {
      console.log(`[${service.name}] Reusing ready service at ${service.readyUrl}`)
      return
    }
    throw new Error(
      `[${service.name}] ${service.readyUrl} is already responding. Stop the existing service or set APPS_BROWSER_REUSE_SERVICES=true to intentionally reuse it.`,
    )
  }
  spawnChild(service.name, service.cmd, service.args, service.env)
  await waitForHttp(service.readyUrl, service.timeoutMs)
}

function staticService(name, dist, port) {
  return {
    name,
    cmd: 'node',
    args: [
      'packages/cli/bin/emp.js',
      'static',
      dist,
      '--host',
      '0.0.0.0',
      '--port',
      String(port),
      '--cors',
      '--spa',
    ],
    readyUrl: `http://${localhost}:${port}/`,
  }
}

const containerService = {
  name: 'rstest-container',
  cmd: 'node',
  args: ['scripts/rstest-browser-mf-container.mjs'],
  readyUrl: `http://${localhost}:51203/`,
  env: {
    APPS_BROWSER_PROXY_TARGETS: JSON.stringify(APP_BROWSER_PROXY_TARGETS),
  },
}

const services = [
  staticService('emp-share', 'packages/emp-share/output', 2100),
  staticService('adapter-host', 'apps/adapter-host/dist', 7701),
  staticService('mf-host', 'apps/mf-host/dist', 6001),
  staticService('mf-app', 'apps/mf-app/dist', 6002),
  staticService('vue-2-base', 'apps/vue-2-base/dist', 9001),
  staticService('vue-2-project', 'apps/vue-2-project/dist', 9002),
  staticService('vue-3-base', 'apps/vue-3-base/dist', 9301),
  staticService('vue-3-project', 'apps/vue-3-project/dist', 9302),
  staticService('react-19-tanstack', 'apps/react-19-tanstack/dist', 1992),
  {
    name: 'demo-api',
    cmd: 'node',
    args: ['apps/demo/test-server.js'],
    readyUrl: `http://${localhost}:3001/api/hello`,
  },
  {
    name: 'demo',
    cmd: 'corepack',
    args: ['pnpm', '--filter', './apps/demo', 'dev'],
    readyUrl: `http://${localhost}:8000/`,
  },
  staticService('tailwind-4', 'apps/tailwind-4/dist', 8104),
  staticService('rspack2-optimization', 'apps/rspack2-optimization/dist', 8102),
  containerService,
]

export async function buildAppsBrowserTargets() {
  await run('corepack', ['pnpm', '--filter', '@empjs/chain', 'build'])
  await run('corepack', ['pnpm', '--filter', '@empjs/cli', 'build'])
  await run('corepack', ['pnpm', '--filter', '@empjs/share', 'build'])
  await run('corepack', ['pnpm', '--filter', './apps/adapter-host', 'build'])
  await run('corepack', ['pnpm', '--filter', './apps/mf-host', 'build'])
  await run('corepack', ['pnpm', '--filter', './apps/mf-app', 'build'])
  await run('corepack', ['pnpm', '--filter', './apps/vue-2-base', 'build'])
  await run('corepack', ['pnpm', '--filter', './apps/vue-2-project', 'build'])
  await run('corepack', ['pnpm', '--filter', './apps/vue-3-base', 'build'])
  await run('corepack', ['pnpm', '--filter', './apps/vue-3-project', 'build'])
  await run('corepack', ['pnpm', '--filter', './apps/react-19-tanstack', 'build'])
  await run('corepack', ['pnpm', '--filter', './apps/tailwind-4', 'build'])
  await run('corepack', ['pnpm', '--filter', './apps/rspack2-optimization', 'build'])
}

export async function startAppsBrowserServices() {
  await buildAppsBrowserTargets()
  for (const service of services) await ensureService(service)
  return {
    cleanup: cleanupAppsBrowserServices,
    proxyTargets: APP_BROWSER_PROXY_TARGETS,
  }
}

export async function startAppsBrowserContainer() {
  await ensureService(containerService)
  return {
    cleanup: cleanupAppsBrowserServices,
    proxyTargets: APP_BROWSER_PROXY_TARGETS,
  }
}
