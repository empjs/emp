import {defineConfig} from '@rslib/core'

export default defineConfig(o => {
  // console.log(o.env, o.env === 'production', o)
  return {
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
      removeConsole: o.envMode !== 'development' ? ['log'] : [],
    },
  }
})
