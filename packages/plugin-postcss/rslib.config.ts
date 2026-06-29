import {defineNodeEsmConfig} from '@empjs/rslib-presets'

export default defineNodeEsmConfig({
  entry: {
    index: 'src/index.ts',
    pxtovw: 'src/pxtovw.ts',
  },
})
