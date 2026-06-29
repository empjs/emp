import {describe, expect, test} from '@rstest/core'
import {existsSync} from 'node:fs'
import {join} from 'node:path'
import {discoverApps, runBench, validateApps} from '../scripts/apps.mjs'
import {
  COMPAT_APP_GROUPS,
  DEFAULT_APP_ACCEPTANCE,
  MERGE_CANDIDATES,
  REMOVE_CANDIDATES,
  TARGET_APP_DIRS,
  getDuplicatePackageNames,
} from '../scripts/apps.catalog.mjs'
import {
  buildEnvLines,
  buildStaticCommand,
  listStaticServices,
  selectStaticServices,
  startStaticServices,
  staticServices,
  validateStaticServices,
  waitForStaticServiceChildren,
} from '../scripts/static-services.mjs'
import {EventEmitter} from 'node:events'
import fs from 'node:fs'
import {repoRoot} from './helpers/repo-root'

describe('apps catalog rules', () => {
  test('default acceptance is intentionally small and canonical', async () => {
    const apps = await discoverApps(repoRoot)
    const appDirs = new Set(apps.map(app => app.dir))

    expect(DEFAULT_APP_ACCEPTANCE).toEqual([
      'rspack2-modern-module',
      'rspack2-optimization',
      'mf-host',
      'mf-app',
      'vue-3-base',
      'vue-3-project',
      'tailwind-4',
      'react-19-tanstack',
    ])
    expect(DEFAULT_APP_ACCEPTANCE.every(dir => appDirs.has(dir))).toBe(true)
    expect(DEFAULT_APP_ACCEPTANCE.length).toBeLessThanOrEqual(8)
  })

  test('current workspace apps still pass structural validation', async () => {
    const apps = await discoverApps(repoRoot)
    await expect(validateApps(apps)).resolves.toEqual([])
  })

  test('remaining duplicate package names stay cataloged during cleanup', async () => {
    const apps = await discoverApps(repoRoot)
    expect(getDuplicatePackageNames(apps)).toEqual({})
  })

  test('merge candidates require evidence before deletion', () => {
    expect(MERGE_CANDIDATES.map(candidate => candidate.group)).toEqual([])
    expect(MERGE_CANDIDATES.every(candidate => candidate.requiredEvidence.length > 0)).toBe(true)
  })

  test('target apps surface is explicit and intentionally small', async () => {
    const apps = await discoverApps(repoRoot)
    const appDirs = apps.map(app => app.dir).sort()

    expect(TARGET_APP_DIRS).toEqual([
      'adapter-app',
      'adapter-host',
      'demo',
      'mf-app',
      'mf-host',
      'react-19-tanstack',
      'rspack2-modern-module',
      'rspack2-optimization',
      'tailwind-4',
      'vue-2-base',
      'vue-2-project',
      'vue-3-base',
      'vue-3-project',
    ])
    expect(TARGET_APP_DIRS).toHaveLength(13)
    expect(TARGET_APP_DIRS.every(dir => appDirs.includes(dir))).toBe(true)
  })

  test('workspace app directories match the target support surface', async () => {
    const apps = await discoverApps(repoRoot)
    const appDirs = apps.map(app => app.dir).sort()

    expect(appDirs).toEqual([...TARGET_APP_DIRS].sort())
  })

  test('old apps are grouped into explicit deletion batches', () => {
    expect(REMOVE_CANDIDATES['batch-1-uncataloged']).toEqual([
      'app-and-host',
      'daisyui-demo',
      'local-build-remote-dev-demo',
      'mf-split-chunk',
      'mf-v3-host',
      'old-func-demo',
      'react-19-runtime',
      'react-router-demo',
      'shadcn-ui',
      'vue-3-with-vue-2',
    ])
    expect(REMOVE_CANDIDATES['batch-2-root-script-cleanup']).toEqual([
      'esm-react-app',
      'esm-react-host',
      'react-eager-app',
      'react-eager-host',
      'react-wouter',
      'unpkg-demo',
    ])
    expect(REMOVE_CANDIDATES['batch-3-compat-collapse']).toEqual([
      'adapter-vue2-host',
      'adapter-vue3-host',
      'auto-pages',
      'emp-window-demo',
      'es5-import-demo',
      'mobile-vw-rem',
      'pixi-js-demo',
      'proxy-demo',
      'react-16-adapter-18',
      'react-18-runtime',
      'rtHost',
      'rtLayout',
      'rtProvider',
      'runtime-18-app',
      'runtime-18-host',
      'tailwind-2',
      'tailwind-3',
      'vue-2-element',
      'vue-2-stylus',
      'vue3-in-vue2',
    ])
  })

  test('compat groups only point to retained app directories', () => {
    const compatDirs = Object.values(COMPAT_APP_GROUPS).flat()

    expect(compatDirs.every(dir => TARGET_APP_DIRS.includes(dir))).toBe(true)
  })

  test('root scripts do not reference retired app projects', async () => {
    const rootPackage = JSON.parse(await fs.promises.readFile(join(repoRoot, 'package.json'), 'utf8'))
    const retiredApps = Object.values(REMOVE_CANDIDATES).flat()
    const scripts = Object.entries(rootPackage.scripts ?? {})
    const staleScripts = scripts.filter(([, command]) => {
      const commandText = String(command)
      return retiredApps.some(appDir => commandText.includes(appDir))
    })

    expect(staleScripts).toEqual([])
  })

  test('public docs do not recommend retired app projects', async () => {
    const retiredApps = Object.values(REMOVE_CANDIDATES).flat()
    const docFiles = [
      'docs/v4-progress-roadmap.html',
      'packages/emp-share/README.md',
      'website/docs/zh/demo/vue2.mdx',
      'website/docs/zh/emp/runtime.mdx',
      'website/docs/zh/guide/basis/tailwind.mdx',
    ]
    const staleReferences = []

    for (const docFile of docFiles) {
      const content = await fs.promises.readFile(join(repoRoot, docFile), 'utf8')
      for (const appDir of retiredApps) {
        if (content.includes(appDir)) staleReferences.push({docFile, appDir})
      }
    }

    expect(staleReferences).toEqual([])
  })
})

describe('legacy apps rules coverage', () => {
  test('projects directory is gone and migrated demo dirs exist', async () => {
    const apps = await discoverApps(repoRoot)
    const appNames = apps.map(app => app.name).sort()
    const appDirs = apps.map(app => app.dir).sort()

    expect(appNames).toContain('rspack2-modern-module')
    expect(appNames).toContain('rspack2-optimization')
    for (const dir of ['mf-host', 'mf-app', 'vue-3-base', 'vue-3-project', 'tailwind-4']) {
      expect(appDirs).toContain(dir)
    }
    expect(existsSync(join(repoRoot, 'projects'))).toBe(false)
  })

  test('dry-run bench emits stable commands for rspack baseline apps', async () => {
    const dryRunResults = await runBench({
      apps: ['rspack2-modern-module', 'rspack2-optimization'],
      cwd: repoRoot,
      dryRun: true,
    })

    expect(dryRunResults).toHaveLength(2)
    expect(dryRunResults.map(result => result.name)).toEqual([
      'rspack2-modern-module',
      'rspack2-optimization',
    ])
    expect(dryRunResults.map(result => result.command)).toEqual([
      'pnpm --filter ./apps/rspack2-modern-module build',
      'pnpm --filter ./apps/rspack2-optimization build',
    ])
    expect(dryRunResults.every(result => result.durationMs === 0)).toBe(true)
    expect(dryRunResults.every(result => typeof result.distSizeBytes === 'number')).toBe(true)
    expect(dryRunResults.every(result => Array.isArray(result.assets))).toBe(true)
  })

  test('static service catalog and commands stay stable', () => {
    const staticServiceIds = staticServices.map(service => service.id).sort()

    expect(staticServiceIds).toEqual([
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
    expect(new Set(staticServiceIds).size).toBe(staticServiceIds.length)

    const reactRuntimeServices = listStaticServices({group: 'react-runtime'}).map(service => service.id).sort()
    expect(reactRuntimeServices).toEqual(['cdn-react-17', 'cdn-react-18', 'cdn-react-19', 'emp-share'])

    const selectedStaticServices = selectStaticServices({services: ['cdn-react-18', 'emp-share']})
    expect(selectedStaticServices.map(service => service.id)).toEqual(['cdn-react-18', 'emp-share'])

    const selectedCommands = selectedStaticServices.map(service => buildStaticCommand(service, {host: '0.0.0.0'}).display)
    expect(selectedCommands).toEqual([
      'node packages/cli/bin/emp.js static packages/cdn-react-18/dist --host 0.0.0.0 --port 1800 --cors',
      'node packages/cli/bin/emp.js static packages/emp-share/output --host 0.0.0.0 --port 2100 --cors',
    ])

    expect(buildEnvLines(selectedStaticServices, {mode: 'development'})).toEqual([
      'EMP_STATIC_CDN_REACT_18=http://localhost:1800/reactRouter.development.umd.js',
      'EMP_STATIC_EMP_SHARE=http://localhost:2100/sdk.js',
    ])
  })

  test('static service validation protects shared ports', () => {
    const conflictIssues = validateStaticServices(
      selectStaticServices({services: ['cdn-react-wouter', 'cdn-react-tanstack']}),
    )

    expect(conflictIssues).toEqual([
      {
        type: 'port-conflict',
        port: 2200,
        services: ['cdn-react-wouter', 'cdn-react-tanstack'],
        message: 'port 2200 is used by cdn-react-wouter, cdn-react-tanstack in the same selection',
      },
    ])
    expect(() => selectStaticServices({group: 'missing-group'})).toThrow(/No static services matched selection/)
    expect(typeof startStaticServices).toBe('function')
  })

  test('static service child watcher reports failing child exit code', async () => {
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
    await expect(childExitCode).resolves.toBe(1)
  })

  test('package scripts no longer call third-party serve directly', async () => {
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
      expect(scripts.every(([, command]) => !String(command).startsWith('serve ./'))).toBe(true)
    }

    const rootPackage = JSON.parse(await fs.promises.readFile(join(repoRoot, 'package.json'), 'utf8'))
    expect(rootPackage.devDependencies?.serve).toBeUndefined()
  })

  test('CI apps job installs Playwright Chromium before browser acceptance', async () => {
    const ciWorkflow = await fs.promises.readFile(join(repoRoot, '.github/workflows/ci.yml'), 'utf8')
    const playwrightInstallIndex = ciWorkflow.indexOf('pnpm exec playwright install --with-deps chromium')
    const appsAcceptanceIndex = ciWorkflow.indexOf('pnpm apps:acceptance')

    expect(playwrightInstallIndex).toBeGreaterThanOrEqual(0)
    expect(appsAcceptanceIndex).toBeGreaterThanOrEqual(0)
    expect(playwrightInstallIndex).toBeLessThan(appsAcceptanceIndex)
  })
})
