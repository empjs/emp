import {defineNodeEsmConfig} from '@empjs/rslib-presets'

export default defineNodeEsmConfig({
  externals: {
    'javascript-stringify': 'commonjs javascript-stringify',
  },
})
