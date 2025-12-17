import {defineConfig, type Options} from 'tsup'

function getOptions(env: 'development' | 'production', watch = false): Options {
  return {
    entry: ['src/react.ts', 'src/reactRouter.ts'],
    format: ['iife'],
    target: 'es5',
    sourcemap: true,
    clean: true,
    dts: true,
    globalName: 'EMP_ADAPTER_REACT',
    env: {NODE_ENV: env},
    define: {
      'process.env.NODE_ENV': JSON.stringify(env),
    },
    minify: env !== 'development' ? 'terser' : false,
    // minify: env !== 'development' ? true : false,
    watch: watch,
    esbuildOptions(options, context) {
      options.legalComments = 'none'
    },
    outExtension: o => {
      return {
        js: `.${env}.umd.js`,
      }
    },
    async onSuccess() {
      console.log('onSuccess!')
    },
  }
}
//
export default defineConfig(o => {
  const watch = !!o.watch
  //
  return [
    getOptions('development', watch), //
    getOptions('production', watch),
  ]
})
