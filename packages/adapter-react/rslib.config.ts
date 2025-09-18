import {defineConfig} from '@rslib/core'

export default defineConfig({
  lib: [
    {
      format: 'esm',
      dts: true,
    },
    {
      format: 'cjs',
    },
  ],
  output: {
    target: 'web',
  },
  performance: {
    removeConsole: ['log'],
  },
})
