import {defineConfig} from '@rstest/core'

const isBrowserMode = process.argv.some(arg => arg === '--browser' || arg.startsWith('--browser.'))
const isListCommand = process.argv.includes('list')
const isWatchCommand = process.argv.includes('watch')
const skipNextBrowserRebuildKey = 'APPS_BROWSER_SKIP_NEXT_REBUILD'
const browserScope = process.env.EMP_BROWSER_SCOPE === 'apps' ? 'apps' : 'all'
const appsBrowserTestFiles = ['test/apps/browser/**/*.browser.ts']
const empShareBrowserTestFiles = ['packages/emp-share/test/browser/**/*.browser.ts']
const browserTestFiles = browserScope === 'apps' ? appsBrowserTestFiles : [...appsBrowserTestFiles, ...empShareBrowserTestFiles]
const appsBrowserForceRerunTriggers = [
  'apps/*/emp*.js',
  'apps/*/emp*.ts',
  'apps/adapter-host/src/**',
  'apps/demo/src/**',
  'apps/mf-app/src/**',
  'apps/mf-host/src/**',
  'apps/react-19-tanstack/src/**',
  'apps/rspack2-optimization/src/**',
  'apps/tailwind-4/src/**',
  'apps/vue-2-base/src/**',
  'apps/vue-2-project/src/**',
  'apps/vue-3-base/src/**',
  'apps/vue-3-project/src/**',
  'packages/cli/src/**',
  'packages/emp-chain/src/**',
  'packages/emp-share/src/**',
  'scripts/apps-browser-harness.mjs',
  'scripts/rstest-browser-mf-container.mjs',
  'test/apps/browser/**/*.browser.ts',
]
const empShareBrowserForceRerunTriggers = ['packages/emp-share/test/browser/**/*.browser.ts', 'packages/emp-share/output/**']
const browserForceRerunTriggers =
  browserScope === 'apps' ? appsBrowserForceRerunTriggers : [...appsBrowserForceRerunTriggers, ...empShareBrowserForceRerunTriggers]

if (isBrowserMode) {
  process.env.RSTEST_CONTAINER_DEV_SERVER ??= 'http://localhost:51203/'
}

let cleanupAppsBrowserServicesOnce: (() => Promise<void>) | undefined
let cleanupAppsBrowserServicesNow: (() => void) | undefined

if (isBrowserMode && !isListCommand) {
  const appsBrowserHarness = await import('./scripts/apps-browser-harness.mjs')
  await appsBrowserHarness.startAppsBrowserServices()
  cleanupAppsBrowserServicesNow = appsBrowserHarness.cleanupAppsBrowserServicesNow
  process.env[skipNextBrowserRebuildKey] = 'true'
  let cleanupStarted = false
  cleanupAppsBrowserServicesOnce = async () => {
    if (cleanupStarted) return
    cleanupStarted = true
    await appsBrowserHarness.cleanupAppsBrowserServices()
  }
  process.once('SIGINT', () => cleanupAppsBrowserServicesOnce?.().finally(() => process.exit(130)))
  process.once('SIGTERM', () => cleanupAppsBrowserServicesOnce?.().finally(() => process.exit(143)))
  process.once('beforeExit', () => {
    void cleanupAppsBrowserServicesOnce?.()
  })
  process.once('exit', () => {
    cleanupAppsBrowserServicesNow?.()
  })
}

const browserRebuildReporter = {
  onTestRunStart: async () => {
    if (!isBrowserMode || isListCommand) return
    if (process.env[skipNextBrowserRebuildKey] === 'true') {
      delete process.env[skipNextBrowserRebuildKey]
      return
    }
    const {buildAppsBrowserTargets} = await import('./scripts/apps-browser-harness.mjs')
    await buildAppsBrowserTargets()
  },
  onTestRunEnd: async () => {
    if (!isBrowserMode || isListCommand || isWatchCommand) return
    await cleanupAppsBrowserServicesOnce?.()
  },
}

export default defineConfig({
  testEnvironment: 'node',
  include: isBrowserMode ? browserTestFiles : ['test/**/*.test.ts'],
  exclude: isBrowserMode ? [] : ['test/**/*.browser.ts', 'test/**/*.browser.test.ts'],
  forceRerunTriggers: isBrowserMode ? browserForceRerunTriggers : undefined,
  reporters: isBrowserMode ? ['default', browserRebuildReporter] : undefined,
  browser: isBrowserMode
    ? {
        enabled: true,
        provider: 'playwright',
        browser: 'chromium',
        viewport: {width: 1440, height: 1000},
      }
    : undefined,
  hookTimeout: isBrowserMode ? 600000 : 5000,
  testTimeout: isBrowserMode ? 600000 : 5000,
})
