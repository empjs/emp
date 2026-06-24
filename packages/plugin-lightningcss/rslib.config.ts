import {defineNodeEsmConfig} from '../../scripts/rslib-presets.mjs'

export default defineNodeEsmConfig({
  entry: {
    index: 'src/index.ts',
    loader: 'src/loader.ts',
  },
})
