import {defineConfig, Options} from 'tsup'
import {shareGlobalName} from './src/helper/config'
export default defineConfig(({watch}): Options[] => {
  return [
    {
      entry: {
        index: 'src/index.ts',
        runtime: 'src/runtime/index.ts',
        mfRuntime: 'src/runtime/mfRuntime.ts',
        adapter: 'src/adapter/index.ts',
        rspack: 'src/plugins/rspack/index.ts',
        adapterVue: 'src/adapter/vue.ts',
      },
      format: ['esm', 'cjs'],
      splitting: false,
      sourcemap: true,
      minify: !watch,
      clean: true,
      dts: true,
      env: {EMPSHARE_ENV: watch ? 'dev' : 'prod'},
      replaceNodeEnv: true, //替换到 process.env.NODE_ENV
      async onSuccess() {
        console.log('onSuccess!')
      },
    },
    {
      outDir: 'output',
      entry: {
        sdk: 'src/library/sdk.ts',
        // sdkPolyfill: 'src/library/sdkPolyfill.ts',
        // full: 'src/library/full.ts',
      } as any,
      target: 'es5',
      format: ['iife'],
      platform: 'browser',
      // treeshake: true,
      shims: true,
      sourcemap: true,
      clean: true,
      dts: true,
      globalName: `${shareGlobalName}`,
      env: {EMPSHARE_ENV: watch ? 'dev' : 'prod'},
      replaceNodeEnv: true, //替换到 process.env.NODE_ENV
      minify: !watch,
      watch: watch,
      esbuildOptions(options: any, context) {
        options.legalComments = 'none'
        options.define.FEDERATION_ALLOW_NEW_FUNCTION = 'true'
        options.logOverride = {
          'direct-eval': 'silent',
        }
      },
      outExtension() {
        return {
          js: '.js',
        }
      },
      async onSuccess() {},
    },
  ]
})
