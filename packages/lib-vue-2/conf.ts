import {defineConfig} from 'tsup'
export default defineConfig(o => {
  const watch = o.watch
  const env = (o.env as any)['NODE_ENV']
  // console.log(env)
  return {
    entry: ['src/runtime.ts'],
    // target: 'es5',
    format: ['iife'],
    sourcemap: true,
    clean: true,
    dts: true,
    globalName: 'EMP_ADAPTER_VUE',
    env: {NODE_ENV: env},
    minify: env !== 'development',
    watch: watch,
    esbuildOptions(options, context) {
      options.legalComments = 'none'
    },
    outExtension: ({format}) => {
      return {
        js: getFormatName(format, env),
      }
    },
    async onSuccess() {
      console.log('onSuccess!')
    },
  }
})

function getFormatName(format, env) {
  let cb = '.js'
  switch (format) {
    case 'esm':
      cb = '.mjs'
      break
    case 'cjs':
      cb = '.cjs'
      break
    case 'iife':
      cb = '.umd.js'
      break
  }
  return env === 'development' ? `.${env}${cb}` : cb
}
