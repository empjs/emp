import {defineNodeEsmConfig} from '../../scripts/rslib-presets.mjs'

export default defineNodeEsmConfig({
  externals: {
    'javascript-stringify': 'commonjs javascript-stringify',
  },
})
