export const ROOT_RSTEST_CONFIG = 'rstest.config.ts'

const rootTestTargetEntries = [
  ['toolchain', ['test/toolchain.rules.test.ts']],
  ['plugins', ['test/plugin-config-shape.test.ts', 'test/plugin-output-coverage.test.ts']],
  ['tsconfig', ['test/tsconfig.rules.test.ts']],
  [
    'rules',
    [
      'apps/test/apps.rules.test.ts',
      'apps/test/apps.browser-coverage.test.ts',
      'test/release.rules.test.ts',
      'test/release-acceptance-report.test.ts',
    ],
  ],
  ['apps-single', ['apps/test/apps.acceptance.test.ts']],
  ['library-output', ['test/library-output.smoke.test.ts']],
]

const releaseTestTargetEntries = [['release-rc1', ['test/release-rc1.acceptance.test.ts']]]

const appsBrowserTestFiles = [
  'apps/adapter-app/test/browser/local-remote.browser.ts',
  'apps/adapter-host/test/browser/smoke.browser.ts',
  'apps/demo/test/browser/proxy.browser.ts',
  'apps/mf-app/test/browser/remote.browser.ts',
  'apps/mf-host/test/browser/mobx.browser.ts',
  'apps/react-19-tanstack/test/browser/react19.browser.ts',
  'apps/rspack2-modern-module/test/browser/smoke.browser.ts',
  'apps/rspack2-optimization/test/browser/chunk.browser.ts',
  'apps/tailwind-4/test/browser/product-form.browser.ts',
  'apps/vue-2-base/test/browser/interactive.browser.ts',
  'apps/vue-2-project/test/browser/remote.browser.ts',
  'apps/vue-3-base/test/browser/interactive.browser.ts',
  'apps/vue-3-project/test/browser/remote.browser.ts',
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
    ...releaseTestTargetEntries,
    ['all', [...rootTestTargetEntries, ...releaseTestTargetEntries].flatMap(([, files]) => files)],
  ]),
)

export const ROOT_BROWSER_TEST_TARGETS = Object.freeze(Object.fromEntries(rootBrowserTestTargetEntries))

export const ROOT_TEST_PACKAGE_SCRIPTS = Object.freeze({
  'test:toolchain': 'toolchain',
  'test:tsconfig': 'tsconfig',
  'test:rules': 'rules',
  'test:apps:single': 'apps-single',
  'test:library-output': 'library-output',
  'test:release:rc1': 'release-rc1',
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
