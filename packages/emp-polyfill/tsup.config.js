import {defineConfig} from 'tsup'
export default defineConfig(({watch}) => {
  return {
    entry: ['src/index.ts', 'src/full.ts', 'src/stable.ts', 'src/actual.ts', 'src/es.ts', 'src/null.ts'],
    target: 'es5',
    format: ['iife'],
    // sourcemap: true,
    clean: true,
    // dts: true,
    env: {NODE_ENV: 'production'},
    minify: true,
    watch: watch,
    esbuildOptions(options, context) {
      options.legalComments = 'none'
    },
    outExtension: ({format}) => {
      return {
        js: '.js',
      }
    },
    async onSuccess() {
      console.log('onSuccess!')
    },
  }
})
