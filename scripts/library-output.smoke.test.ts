import {describe, expect, test} from '@rstest/core'
import {execFile as execFileCallback, spawn} from 'node:child_process'
import {existsSync, readFileSync} from 'node:fs'
import {createServer} from 'node:net'
import {join} from 'node:path'
import {promisify} from 'node:util'
import {buildStaticCommand, staticServices} from './static-services.mjs'

const execFile = promisify(execFileCallback)
const repoRoot = process.cwd()

const buildTargets = [
  './packages/cdn-react-18',
  './packages/cdn-react-wouter',
  './packages/cdn-react-19-tanstack-router',
  './packages/cdn-vue-router-pinia',
  './packages/lib-react-17',
  './packages/lib-vue-2',
  './packages/emp-share',
]

const expectedArtifacts = [
  'packages/cdn-react-18/dist/reactRouter.development.umd.js',
  'packages/cdn-react-18/dist/reactRouter.production.umd.js',
  'packages/cdn-react-wouter/dist/reactRouter.development.umd.js',
  'packages/cdn-react-wouter/dist/reactRouter.production.umd.js',
  'packages/cdn-react-19-tanstack-router/dist/reactRouter.development.umd.js',
  'packages/cdn-react-19-tanstack-router/dist/reactRouter.production.umd.js',
  'packages/cdn-vue-router-pinia/dist/vueRouter.development.umd.js',
  'packages/cdn-vue-router-pinia/dist/vueRouter.production.umd.js',
  'packages/lib-react-17/dist/runtime.umd.js',
  'packages/lib-react-17/dist/runtime.js',
  'packages/lib-react-17/dist/runtime.d.ts',
  'packages/lib-vue-2/dist/runtime.umd.js',
  'packages/lib-vue-2/dist/runtime.js',
  'packages/lib-vue-2/dist/runtime.d.ts',
  'packages/emp-share/output/sdk.js',
  'packages/emp-share/dist/rspack.js',
  'packages/emp-share/dist/runtime.js',
]

const httpSmokeTargets = [
  {serviceId: 'cdn-react-18', expectedGlobal: 'EMP_ADAPTER_REACT'},
  {serviceId: 'cdn-react-wouter', expectedGlobal: 'BIGO_NOVA_REACT'},
  {serviceId: 'cdn-react-tanstack', expectedGlobal: 'EMP_REACT_19_TANSTACK'},
  {serviceId: 'cdn-vue-router-pinia', expectedGlobal: 'EMP_ADAPTER_VUE'},
  {serviceId: 'lib-react-17', expectedGlobal: 'EMP_ADAPTER_REACT'},
  {serviceId: 'lib-vue-2', expectedGlobal: 'EMP_ADAPTER_VUE'},
  {serviceId: 'emp-share', expectedGlobal: 'EMP_SHARE_RUNTIME'},
]

async function getFreePort() {
  const server = createServer()
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })
  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : 0
  await new Promise<void>(resolve => server.close(() => resolve()))
  return port
}

async function waitForHttp(url: string, timeoutMs = 30000) {
  const startedAt = Date.now()
  let lastError: unknown
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.ok) return response
      lastError = new Error(`${url} returned ${response.status}`)
    } catch (error) {
      lastError = error
    }
    await new Promise(resolve => setTimeout(resolve, 300))
  }
  throw new Error(`Timed out waiting for ${url}: ${String(lastError)}`)
}

async function stopProcess(child: ReturnType<typeof spawn>) {
  if (child.exitCode !== null || !child.pid) return
  try {
    globalThis.process.kill(-child.pid, 'SIGTERM')
  } catch {
    child.kill('SIGTERM')
  }
  await Promise.race([
    new Promise(resolve => child.once('exit', resolve)),
    new Promise(resolve => setTimeout(resolve, 2000)),
  ])
}

describe('library output package smoke', () => {
  test('Rslib/CDN packages build and serve representative runtime assets', async () => {
    for (const target of buildTargets) {
      await execFile('corepack', ['pnpm@10.33.0', '--filter', target, 'build'], {
        cwd: repoRoot,
        maxBuffer: 1024 * 1024 * 20,
      })
    }

    for (const artifact of expectedArtifacts) {
      expect(existsSync(join(repoRoot, artifact))).toBe(true)
    }

    expect(readFileSync(join(repoRoot, 'packages/emp-share/output/sdk.js'), 'utf8')).toContain('EMP_SHARE_RUNTIME')
    expect(readFileSync(join(repoRoot, 'packages/lib-react-17/dist/runtime.umd.js'), 'utf8')).toContain(
      'EMP_ADAPTER_REACT',
    )
    expect(readFileSync(join(repoRoot, 'packages/lib-vue-2/dist/runtime.umd.js'), 'utf8')).toContain('EMP_ADAPTER_VUE')

    for (const target of httpSmokeTargets) {
      const service = staticServices.find(item => item.id === target.serviceId)
      expect(service).toBeTruthy()
      if (!service) continue

      const port = await getFreePort()
      const command = buildStaticCommand(service, {host: '127.0.0.1', port})
      const child = spawn(command.cmd, command.args, {
        cwd: repoRoot,
        detached: true,
        env: process.env,
        stdio: ['ignore', 'pipe', 'pipe'],
      })

      try {
        for (const asset of new Set([service.assets.development, service.assets.production])) {
          const response = await waitForHttp(`${command.url}${asset}`)
          expect(response.headers.get('access-control-allow-origin')).toBe('*')
          expect(response.headers.get('content-type')).toContain('javascript')
          expect(await response.text()).toContain(target.expectedGlobal)
        }
      } finally {
        await stopProcess(child)
      }
    }
  }, 240000)
})
