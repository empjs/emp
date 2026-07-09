import {describe, expect, test} from '@rstest/core'
import {existsSync} from 'node:fs'
import {join} from 'node:path'
import {discoverApps, runBench, validateApps} from '../../scripts/apps.mjs'
import {
  DEFAULT_APP_ACCEPTANCE,
  LEGACY_PROJECT_DIRS,
  RETIRED_APP_DIRS,
  TARGET_APP_DIRS,
  getDuplicatePackageNames,
} from '../../scripts/apps.catalog.mjs'
import {
  buildEnvLines,
  buildStaticCommand,
  listStaticServices,
  selectStaticServices,
  startStaticServices,
  staticServices,
  validateStaticServices,
  waitForStaticServiceChildren,
} from '../../scripts/static-services.mjs'
import {EventEmitter} from 'node:events'
import fs from 'node:fs'
import {repoRoot} from '../../test/helpers/repo-root'

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

  test('retired app directories are sorted and absent from the workspace', async () => {
    const apps = await discoverApps(repoRoot)
    const appDirs = apps.map(app => app.dir)

    expect(RETIRED_APP_DIRS).toEqual([...RETIRED_APP_DIRS].sort())
    expect(RETIRED_APP_DIRS.every(dir => !appDirs.includes(dir))).toBe(true)
    expect(RETIRED_APP_DIRS.every(dir => !TARGET_APP_DIRS.includes(dir))).toBe(true)
  })

  test('legacy projects from upstream are fully classified as active or retired', () => {
    const classifiedDirs = new Set([...TARGET_APP_DIRS, ...RETIRED_APP_DIRS])
    const missingLegacyDirs = LEGACY_PROJECT_DIRS.filter(dir => !classifiedDirs.has(dir))

    expect(LEGACY_PROJECT_DIRS).toEqual([...LEGACY_PROJECT_DIRS].sort())
    expect(missingLegacyDirs).toEqual([])
  })

  test('legacy Tailwind and UI demos stay retired while current Tailwind coverage uses v4 apps', () => {
    expect(RETIRED_APP_DIRS).toEqual(
      expect.arrayContaining(['tailwind-2', 'tailwind-3', 'tailwind-demo', 'daisyui-demo', 'shadcn-ui']),
    )
    expect(TARGET_APP_DIRS).toEqual(expect.arrayContaining(['tailwind-4', 'react-19-tanstack']))
    expect(TARGET_APP_DIRS).not.toEqual(expect.arrayContaining(['tailwind-2', 'tailwind-3']))
  })

  test('browser app tests import shared helpers through the root test support alias', async () => {
    const rootTestTargets = await import('../../scripts/root-test-targets.mjs')
    const browserTestFiles = [...new Set(Object.values(rootTestTargets.ROOT_BROWSER_TEST_TARGETS).flat() as string[])]
    const rstestConfig = await fs.promises.readFile(join(repoRoot, 'rstest.config.ts'), 'utf8')
    const nonAliasImports = []

    for (const file of browserTestFiles.filter(file => file.startsWith('apps/'))) {
      const content = await fs.promises.readFile(join(repoRoot, file), 'utf8')
      const unsupportedImports = content
        .split('\n')
        .filter(line => line.includes('test-support/browser/') && !line.includes("from '@empjs/test-support/browser/"))
      if (unsupportedImports.length > 0) nonAliasImports.push({file, unsupportedImports})
      expect(content).toContain('@empjs/test-support/browser/frame')
    }

    expect(rstestConfig).toContain("'@empjs/test-support'")
    expect(rstestConfig).toContain('./apps/test-support')
    expect(nonAliasImports).toEqual([])
  })

  test('root scripts do not reference retired app projects', async () => {
    const rootPackage = JSON.parse(await fs.promises.readFile(join(repoRoot, 'package.json'), 'utf8'))
    const scripts = Object.entries(rootPackage.scripts ?? {})
    const staleScripts = scripts.filter(([, command]) => {
      const commandText = String(command)
      return RETIRED_APP_DIRS.some(appDir => commandText.includes(appDir))
    })

    expect(staleScripts).toEqual([])
  })

  test('public docs do not recommend retired app projects', async () => {
    const collectDocs = async (dir: string): Promise<string[]> => {
      const entries = await fs.promises.readdir(join(repoRoot, dir), {withFileTypes: true})
      const files = await Promise.all(
        entries.map(async entry => {
          const entryPath = `${dir}/${entry.name}`
          if (entry.isDirectory()) return collectDocs(entryPath)
          return /\.(md|mdx|html)$/.test(entry.name) ? [entryPath] : []
        }),
      )
      return files.flat()
    }
    const allowedRetiredReference = (line: string) =>
      /不属于|不在|不再|退出|不恢复|不纳入|已退休|retired/i.test(line)
    const docFiles = [
      'docs/v4-progress-roadmap.html',
      'packages/emp-share/README.md',
      ...(await collectDocs('website/docs/zh')),
    ]
    const staleReferences = []

    for (const docFile of docFiles) {
      const content = await fs.promises.readFile(join(repoRoot, docFile), 'utf8')
      const contentToCheck = content
        .split('\n')
        .filter(line => !allowedRetiredReference(line))
        .join('\n')
      for (const appDir of RETIRED_APP_DIRS) {
        if (contentToCheck.includes(appDir)) staleReferences.push({docFile, appDir})
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

  test('apps acceptance keeps browser smoke out of the default apps acceptance lane', async () => {
    const rootPackage = JSON.parse(await fs.promises.readFile(join(repoRoot, 'package.json'), 'utf8'))
    const ciWorkflow = await fs.promises.readFile(join(repoRoot, '.github/workflows/ci.yml'), 'utf8')
    const rstestConfig = await fs.promises.readFile(join(repoRoot, 'rstest.config.ts'), 'utf8')
    const rootTestTargets = await fs.promises.readFile(join(repoRoot, 'scripts/root-test-targets.mjs'), 'utf8')
    const browserRunner = await fs.promises.readFile(join(repoRoot, 'scripts/run-app-browser-tests.mjs'), 'utf8')
    const workflowGuard = await fs.promises.readFile(join(repoRoot, 'scripts/emp-workflow-check.mjs'), 'utf8')
    const reactTanstackConfig = await fs.promises.readFile(join(repoRoot, 'apps/react-19-tanstack/emp.config.ts'), 'utf8')

    expect(rootPackage.scripts?.['test:apps:mf']).toBeUndefined()
    expect(rootPackage.scripts?.['test:apps:browser']).toBe('node scripts/run-app-browser-tests.mjs')
    expect(rootPackage.scripts?.['test:browser:all']).toContain('rstest')
    expect(rootPackage.scripts?.['test:browser:all']).toContain('--browser.name chromium')
    expect(rootPackage.scripts?.['test:browser:watch']).toBe('pnpm exec rstest watch --browser --browser.headless=false')
    expect(rootPackage.scripts?.['apps:acceptance']).not.toContain('pnpm test:apps:mf')
    expect(rootPackage.scripts?.['apps:acceptance']).not.toContain('pnpm test:apps:browser')
    expect(ciWorkflow).not.toContain('pnpm exec playwright install --with-deps chromium')
    expect(rootTestTargets).not.toContain('apps-mf')
    expect(rootTestTargets).not.toContain('test/apps.mf-browser.test.ts')
    expect(rootTestTargets).not.toContain('test/apps.mf-browser.browser.ts')
    expect(rootTestTargets).toContain("'apps-browser'")
    expect(rootTestTargets).toContain("'emp-share-browser'")
    expect(rootTestTargets).toContain('apps/mf-app/test/browser/remote.browser.ts')
    expect(rootTestTargets).toContain('apps/vue-3-project/test/browser/remote.browser.ts')
    expect(rootTestTargets).toContain('packages/emp-share/test/browser/force-remote.browser.ts')
    expect(rootTestTargets).not.toContain('test/apps.browser.browser.ts')
    expect(rstestConfig).toContain('apps/*/test/browser/**/*.browser.ts')
    expect(rstestConfig).toContain('packages/emp-share/test/browser/**/*.browser.ts')
    expect(rstestConfig).toContain("process.env.EMP_BROWSER_SCOPE === 'apps'")
    expect(rstestConfig).toContain('browserForceRerunTriggers')
    expect(rstestConfig).toContain('browserRebuildReporter')
    expect(rstestConfig).toContain('apps/react-19-tanstack/src/**')
    expect(rstestConfig).toContain("'default', browserRebuildReporter")
    expect(rstestConfig).not.toContain("process.env.APPS_BROWSER_REUSE_SERVICES ??= 'true'")
    expect(rstestConfig).not.toContain("['test/apps.mf-browser.browser.ts']")
    expect(browserRunner).toContain("'watch', '--browser',")
    expect(browserRunner).toContain("'--browser.headless=false'")
    expect(browserRunner).toContain("'corepack'")
    expect(browserRunner).toContain("EMP_BROWSER_SCOPE: 'apps'")
    expect(browserRunner).toContain("'--browser.name'")
    expect(browserRunner).toContain('apps/*/test/browser/**/*.browser.ts')
    expect(reactTanstackConfig).toContain('RSTEST_CONTAINER_DEV_SERVER')
    expect(reactTanstackConfig).toContain("'/container-static/react-19-tanstack/'")
    expect(workflowGuard).toContain('ROOT_BROWSER_TEST_TARGETS')
    expect(workflowGuard).toContain('apps/<app>/test/browser')
    expect(workflowGuard).toContain('packages/emp-share/test/browser')
    expect(workflowGuard).toContain('test:apps:browser')
    expect(rootPackage.devDependencies?.['@rstest/browser']).toBe('0.11.0')
    expect(rootPackage.devDependencies?.playwright).toBe('1.61.1')
  })
})
