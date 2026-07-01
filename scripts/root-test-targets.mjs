export const ROOT_RSTEST_CONFIG = 'rstest.config.ts'

const rootTestTargetEntries = [
  ['toolchain', ['test/toolchain.rules.test.ts']],
  ['tsconfig', ['test/tsconfig.rules.test.ts']],
  ['rules', ['test/apps.rules.test.ts', 'test/apps.browser-coverage.test.ts', 'test/release.rules.test.ts']],
  ['apps-single', ['test/apps.acceptance.test.ts']],
  ['library-output', ['test/library-output.smoke.test.ts']],
]

const appsBrowserTestFiles = [
  'test/apps/browser/adapter-host/smoke.browser.ts',
  'test/apps/browser/demo/proxy.browser.ts',
  'test/apps/browser/mf-app/remote.browser.ts',
  'test/apps/browser/mf-host/mobx.browser.ts',
  'test/apps/browser/react-19-tanstack/react19.browser.ts',
  'test/apps/browser/rspack2-optimization/chunk.browser.ts',
  'test/apps/browser/tailwind-4/product-form.browser.ts',
  'test/apps/browser/vue-2-base/interactive.browser.ts',
  'test/apps/browser/vue-2-project/remote.browser.ts',
  'test/apps/browser/vue-3-base/interactive.browser.ts',
  'test/apps/browser/vue-3-project/remote.browser.ts',
]

const empShareBrowserTestFiles = [
  'packages/emp-share/test/browser/force-remote.browser.ts',
  'packages/emp-share/test/browser/library-global.browser.ts',
  'packages/emp-share/test/browser/runtime-sdk.browser.ts',
]

const rootBrowserTestTargetEntries = [
  ['apps-browser', appsBrowserTestFiles],
  ['emp-share-browser', empShareBrowserTestFiles],
  ['browser-all', [...appsBrowserTestFiles, ...empShareBrowserTestFiles]],
]

export const ROOT_TEST_TARGET_ORDER = Object.freeze(rootTestTargetEntries.map(([targetName]) => targetName))

export const ROOT_TEST_TARGETS = Object.freeze(
  Object.fromEntries([
    ...rootTestTargetEntries,
    ['all', rootTestTargetEntries.flatMap(([, files]) => files)],
  ]),
)

export const ROOT_BROWSER_TEST_TARGETS = Object.freeze(Object.fromEntries(rootBrowserTestTargetEntries))

export const ROOT_TEST_PACKAGE_SCRIPTS = Object.freeze({
  'test:toolchain': 'toolchain',
  'test:tsconfig': 'tsconfig',
  'test:rules': 'rules',
  'test:apps:single': 'apps-single',
  'test:library-output': 'library-output',
})

export const ROOT_BROWSER_TEST_PACKAGE_SCRIPTS = Object.freeze({
  'test:apps:browser': 'apps-browser',
  'test:browser:all': 'browser-all',
})

export const rootTestCommand = targetName => `node scripts/run-root-test.mjs ${targetName}`
export const rootBrowserTestCommand = targetName => {
  if (targetName === 'apps-browser') return 'node scripts/run-app-browser-tests.mjs'
  if (targetName === 'browser-all') return 'corepack pnpm exec rstest run --config rstest.config.ts --browser --browser.name chromium'
  return `node scripts/run-root-test.mjs ${targetName}`
}
