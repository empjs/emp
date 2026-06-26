import assert from 'node:assert/strict'
import {EventEmitter} from 'node:events'
import fs, {existsSync} from 'node:fs'
import path, {join} from 'node:path'
import {discoverApps, runBench, validateApps} from './apps.mjs'
import {
  buildStaticCommand,
  buildEnvLines,
  listStaticServices,
  selectStaticServices,
  startStaticServices,
  staticServices,
  validateStaticServices,
  waitForStaticServiceChildren,
} from './static-services.mjs'

const repoRoot = path.resolve(import.meta.dirname, '..')

const apps = await discoverApps(repoRoot)
const appNames = apps.map(app => app.name).sort()
const appDirs = apps.map(app => app.dir).sort()

assert.ok(appNames.includes('rspack2-modern-module'))
assert.ok(appNames.includes('rspack2-optimization'))

for (const dir of ['mf-host', 'mf-app', 'vue-3-base', 'vue-3-project', 'tailwind-4']) {
  assert.ok(appDirs.includes(dir), `apps must include migrated demo: ${dir}`)
}

assert.equal(existsSync(join(repoRoot, 'projects')), false)

const issues = await validateApps(apps)
assert.deepEqual(issues, [])

const dryRunResults = await runBench({
  apps: ['rspack2-modern-module', 'rspack2-optimization'],
  cwd: repoRoot,
  dryRun: true,
})

assert.equal(dryRunResults.length, 2)
assert.deepEqual(
  dryRunResults.map(result => result.name),
  ['rspack2-modern-module', 'rspack2-optimization'],
)
assert.ok(dryRunResults.every(result => result.command.includes('pnpm --filter')))
assert.deepEqual(
  dryRunResults.map(result => result.command),
  [
    'pnpm --filter ./apps/rspack2-modern-module build',
    'pnpm --filter ./apps/rspack2-optimization build',
  ],
)
assert.ok(dryRunResults.every(result => result.durationMs === 0))
assert.ok(dryRunResults.every(result => typeof result.distSizeBytes === 'number'))
assert.ok(dryRunResults.every(result => Array.isArray(result.assets)))

const staticServiceIds = staticServices.map(service => service.id).sort()

assert.deepEqual(staticServiceIds, [
  'cdn-react-17',
  'cdn-react-18',
  'cdn-react-19',
  'cdn-react-tanstack',
  'cdn-react-wouter',
  'cdn-vue-2',
  'cdn-vue-3',
  'cdn-vue-router-pinia',
  'emp-polyfill',
  'emp-share',
  'lib-react-17',
  'lib-vue-2',
])

assert.equal(new Set(staticServiceIds).size, staticServiceIds.length)

const reactRuntimeServices = listStaticServices({group: 'react-runtime'}).map(service => service.id).sort()
assert.deepEqual(reactRuntimeServices, ['cdn-react-17', 'cdn-react-18', 'cdn-react-19', 'emp-share'])

const selectedStaticServices = selectStaticServices({services: ['cdn-react-18', 'emp-share']})
assert.deepEqual(
  selectedStaticServices.map(service => service.id),
  ['cdn-react-18', 'emp-share'],
)

const selectedCommands = selectedStaticServices.map(service => buildStaticCommand(service, {host: '0.0.0.0'}).display)
assert.deepEqual(selectedCommands, [
  'node packages/cli/bin/emp.js static packages/cdn-react-18/dist --host 0.0.0.0 --port 1800 --cors',
  'node packages/cli/bin/emp.js static packages/emp-share/output --host 0.0.0.0 --port 2100 --cors',
])

const localCdnEnvLines = buildEnvLines(selectedStaticServices, {mode: 'development'})
assert.deepEqual(localCdnEnvLines, [
  'EMP_STATIC_CDN_REACT_18=http://localhost:1800/reactRouter.development.umd.js',
  'EMP_STATIC_EMP_SHARE=http://localhost:2100/sdk.js',
])

const conflictIssues = validateStaticServices(
  selectStaticServices({services: ['cdn-react-wouter', 'cdn-react-tanstack']}),
)
assert.deepEqual(conflictIssues, [
  {
    type: 'port-conflict',
    port: 2200,
    services: ['cdn-react-wouter', 'cdn-react-tanstack'],
    message: 'port 2200 is used by cdn-react-wouter, cdn-react-tanstack in the same selection',
  },
])

assert.throws(() => selectStaticServices({group: 'missing-group'}), /No static services matched selection/)
assert.equal(typeof startStaticServices, 'function')

class FakeChildProcess extends EventEmitter {
  killed = false

  kill() {
    this.killed = true
  }
}

const failedChild = new FakeChildProcess()
const successfulChild = new FakeChildProcess()
const childExitCode = waitForStaticServiceChildren([
  {child: successfulChild},
  {child: failedChild},
])
successfulChild.emit('exit', 0, null)
failedChild.emit('exit', 1, null)
assert.equal(await childExitCode, 1)

const packageScriptFiles = [
  'packages/cdn-react-17/package.json',
  'packages/cdn-react-18/package.json',
  'packages/cdn-react-19/package.json',
  'packages/cdn-react-wouter/package.json',
  'packages/cdn-react-19-tanstack-router/package.json',
  'packages/cdn-vue-2/package.json',
  'packages/cdn-vue-3/package.json',
  'packages/cdn-vue-router-pinia/package.json',
  'packages/lib-react-17/package.json',
  'packages/lib-vue-2/package.json',
  'packages/emp-share/package.json',
  'packages/emp-polyfill/package.json',
]

for (const packageScriptFile of packageScriptFiles) {
  const pkg = JSON.parse(await fs.promises.readFile(join(repoRoot, packageScriptFile), 'utf8'))
  const scripts = Object.entries(pkg.scripts ?? {})
  assert.ok(
    scripts.every(([, command]) => !String(command).startsWith('serve ./')),
    `${packageScriptFile} must not use third-party serve directly`,
  )
}

const rootPackage = JSON.parse(await fs.promises.readFile(join(repoRoot, 'package.json'), 'utf8'))
assert.equal(rootPackage.devDependencies?.serve, undefined)
