import {defineNodeEsmConfig} from '@empjs/rslib-presets'

export default defineNodeEsmConfig({
  syntax: ['node >= 20.19.0'],
  define: ({isDev}) => ({
    'process.env.ENV': JSON.stringify(isDev ? 'dev' : 'prod'),
  }),
  externals: {
    '@rsdoctor/rspack-plugin': 'commonjs @rsdoctor/rspack-plugin',
  },
})
