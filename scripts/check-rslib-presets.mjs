import {readFileSync} from 'node:fs'

const nodeEsmPackages = [
  'packages/cli/rslib.config.ts',
  'packages/emp-chain/rslib.config.ts',
  'packages/plugin-lightningcss/rslib.config.ts',
  'packages/plugin-postcss/rslib.config.ts',
  'packages/plugin-react/rslib.config.ts',
  'packages/plugin-stylus/rslib.config.ts',
  'packages/plugin-tailwindcss/rslib.config.ts',
  'packages/plugin-vue2/rslib.config.ts',
  'packages/plugin-vue3/rslib.config.ts',
]

let failed = false

for (const file of nodeEsmPackages) {
  const content = readFileSync(file, 'utf8')
  if (!content.includes("from '@empjs/rslib-presets'")) {
    console.error(`${file}: missing @empjs/rslib-presets import`)
    failed = true
  }
  for (const duplicate of ['node22Syntax', 'nodeSyntax', 'esmShims']) {
    if (content.includes(`const ${duplicate}`)) {
      console.error(`${file}: duplicate ${duplicate} should live in packages/rslib-presets/index.mjs`)
      failed = true
    }
  }
}

if (failed) {
  process.exit(1)
}

console.log(`rslib preset check passed for ${nodeEsmPackages.length} packages`)
