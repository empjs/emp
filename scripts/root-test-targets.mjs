export const ROOT_RSTEST_CONFIG = 'rstest.config.ts'

const rootTestTargetEntries = [
  ['toolchain', ['test/toolchain.rules.test.ts']],
  ['tsconfig', ['test/tsconfig.rules.test.ts']],
  ['rules', ['test/apps.rules.test.ts', 'test/release.rules.test.ts']],
  ['apps-single', ['test/apps.acceptance.test.ts']],
  ['library-output', ['test/library-output.smoke.test.ts']],
]

export const ROOT_TEST_TARGET_ORDER = Object.freeze(rootTestTargetEntries.map(([targetName]) => targetName))

export const ROOT_TEST_TARGETS = Object.freeze(
  Object.fromEntries([
    ...rootTestTargetEntries,
    ['all', rootTestTargetEntries.flatMap(([, files]) => files)],
  ]),
)

export const ROOT_TEST_PACKAGE_SCRIPTS = Object.freeze({
  'test:toolchain': 'toolchain',
  'test:tsconfig': 'tsconfig',
  'test:rules': 'rules',
  'test:apps:single': 'apps-single',
  'test:library-output': 'library-output',
})

export const rootTestCommand = targetName => `node scripts/run-root-test.mjs ${targetName}`
