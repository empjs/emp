import {spawn} from 'node:child_process'
import {fileURLToPath} from 'node:url'
import net from 'node:net'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const localhost = '127.0.0.1'
const children = new Set()
const startedServiceNames = new Set()
const allowExistingServices = process.env.APPS_BROWSER_REUSE_SERVICES === 'true'
const startedServicesEnvKey = 'APPS_BROWSER_STARTED_SERVICES'
const serviceFilterEnvKey = 'APPS_BROWSER_SERVICE_FILTER'

async function findFreePort(host = localhost) {
  return await new Promise((resolve, reject) => {
    const server = net.createServer()
    server.once('error', reject)
    server.listen(0, host, () => {
      const address = server.address()
      if (!address || typeof address === 'string') {
        server.close(() => reject(new Error('Unable to allocate demo API port')))
        return
      }
      server.close(() => resolve(address.port))
    })
  })
}

const demoApiPort = Number(process.env.APPS_BROWSER_DEMO_API_PORT ?? (await findFreePort()))
process.env.EMP_DEMO_API_PORT = String(demoApiPort)

export const APP_BROWSER_PROXY_TARGETS = Object.freeze({
  'adapter-app': `http://${localhost}:7702/`,
  'adapter-host': `http://${localhost}:7701/`,
  demo: `http://${localhost}:8000/`,
  'dual-role-a': `http://${localhost}:8201/`,
  'dual-role-b': `http://${localhost}:8202/`,
  'esm-federation': `http://${localhost}:8103/`,
  'emp-share': `http://${localhost}:2100/`,
  'mf-app': `http://${localhost}:6002/`,
  'mf-host': `http://${localhost}:6001/`,
  'react-19-tanstack': `http://${localhost}:1992/`,
  'rspack2-modern-module': `http://${localhost}:8101/`,
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
  child.stdout.unref?.()
  child.stderr.unref?.()
  child.unref()
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
  staticService('adapter-app', 'apps/adapter-app/dist', 7702),
  staticService('adapter-host', 'apps/adapter-host/dist', 7701),
  staticService('dual-role-a', 'apps/dual-role/dist', 8201),
  staticService('dual-role-b', 'apps/dual-role/dist', 8202),
  staticService('esm-federation', 'apps/esm-federation/dist', 8103),
  staticService('mf-host', 'apps/mf-host/dist', 6001),
  {
    name: 'mf-app',
    cmd: 'corepack',
    args: ['pnpm', '--filter', './apps/mf-app', 'dev'],
    readyUrl: `http://${localhost}:6002/`,
  },
  staticService('vue-2-base', 'apps/vue-2-base/dist', 9001),
  staticService('vue-2-project', 'apps/vue-2-project/dist', 9002),
  staticService('vue-3-base', 'apps/vue-3-base/dist', 9301),
  staticService('vue-3-project', 'apps/vue-3-project/dist', 9302),
  staticService('react-19-tanstack', 'apps/react-19-tanstack/dist', 1992),
  {
    name: 'demo-api',
    cmd: 'node',
    args: ['apps/demo/test-server.js'],
    readyUrl: `http://${localhost}:${demoApiPort}/api/hello`,
  },
  {
    name: 'demo',
    cmd: 'corepack',
    args: ['pnpm', '--filter', './apps/demo', 'dev'],
    readyUrl: `http://${localhost}:8000/`,
  },
  staticService('tailwind-4', 'apps/tailwind-4/dist', 8104),
  staticService('rspack2-modern-module', 'apps/rspack2-modern-module/dist', 8101),
  staticService('rspack2-optimization', 'apps/rspack2-optimization/dist', 8102),
  containerService,
]

function selectedBrowserServiceNames() {
  return new Set(
    (process.env[serviceFilterEnvKey] ?? '')
      .split(',')
      .map(name => name.trim())
      .filter(Boolean),
  )
}

function shouldRunNamedTarget(name, selectedNames) {
  return selectedNames.size === 0 || selectedNames.has(name)
}

function shouldRunService(service, selectedNames) {
  return (
    shouldRunNamedTarget(service.name, selectedNames) ||
    (service.name === 'demo-api' && selectedNames.has('demo')) ||
    service.name === containerService.name
  )
}

async function buildBrowserAppTarget(name, filter, args) {
  if (shouldRunNamedTarget(name, filter)) await run('corepack', args)
}

export async function buildAppsBrowserTargets(filter = selectedBrowserServiceNames()) {
  await run('corepack', ['pnpm', '--filter', '@empjs/chain', 'build'])
  await run('corepack', ['pnpm', '--filter', '@empjs/cli', 'build'])
  await run('corepack', ['pnpm', '--filter', '@empjs/share', 'build'])
  await buildBrowserAppTarget('vue-2-base', filter, ['pnpm', '--filter', './apps/vue-2-base', 'build'])
  await buildBrowserAppTarget('vue-3-base', filter, ['pnpm', '--filter', './apps/vue-3-base', 'build'])
  await buildBrowserAppTarget('adapter-host', filter, ['pnpm', '--filter', './apps/adapter-host', 'build'])
  await buildBrowserAppTarget('adapter-app', filter, ['pnpm', '--filter', './apps/adapter-app', 'build'])
  if (filter.size === 0 || filter.has('dual-role-a') || filter.has('dual-role-b')) {
    await run('corepack', ['pnpm', '--filter', './apps/dual-role', 'build'])
  }
  await buildBrowserAppTarget('esm-federation', filter, ['pnpm', '--filter', './apps/esm-federation', 'build'])
  await buildBrowserAppTarget('mf-host', filter, ['pnpm', '--filter', './apps/mf-host', 'build'])
  await buildBrowserAppTarget('mf-app', filter, ['pnpm', '--filter', './apps/mf-app', 'build'])
  await buildBrowserAppTarget('vue-2-project', filter, ['pnpm', '--filter', './apps/vue-2-project', 'build'])
  await buildBrowserAppTarget('vue-3-project', filter, ['pnpm', '--filter', './apps/vue-3-project', 'build'])
  await buildBrowserAppTarget('react-19-tanstack', filter, ['pnpm', '--filter', './apps/react-19-tanstack', 'build'])
  await buildBrowserAppTarget('tailwind-4', filter, ['pnpm', '--filter', './apps/tailwind-4', 'build'])
  await buildBrowserAppTarget('rspack2-modern-module', filter, ['pnpm', '--filter', './apps/rspack2-modern-module', 'build'])
  await buildBrowserAppTarget('rspack2-optimization', filter, ['pnpm', '--filter', './apps/rspack2-optimization', 'build'])
}

export async function startAppsBrowserServices() {
  const selectedNames = selectedBrowserServiceNames()
  await buildAppsBrowserTargets(selectedNames)
  for (const service of services.filter(service => shouldRunService(service, selectedNames))) await ensureService(service)
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
