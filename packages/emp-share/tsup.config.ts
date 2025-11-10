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
        react: 'src/framework/react/index.ts',
        vue: 'src/framework/vue/index.ts',
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
      treeshake: true,
      shims: false,
      sourcemap: false,
      clean: true,
      // dts: true,
      globalName: `${shareGlobalName}`,
      env: {EMPSHARE_ENV: watch ? 'dev' : 'prod'},
      define: {
        'process.env.NODE_ENV': JSON.stringify(watch ? 'development' : 'production'),
        'process.env.FEDERATION_DEBUG': JSON.stringify(!!watch),
      },
      replaceNodeEnv: true, //替换到 process.env.NODE_ENV
      minify: watch ? false : 'terser',
      // watch: watch,
      esbuildOptions(options: any, context) {
        options.legalComments = 'none'
        options.define.FEDERATION_ALLOW_NEW_FUNCTION = 'true'
        // 移除调试分支，减小体积（不影响运行时日志输出）
        options.define.FEDERATION_DEBUG = `${!!watch}`
        // 进一步压缩（无副作用）
        options.minifySyntax = true
        options.minifyIdentifiers = true
        options.minifyWhitespace = true
        // 保留 console 输出，仅移除 debugger（若存在）
        options.drop = ['debugger']
        options.logOverride = {
          'direct-eval': 'silent',
        }
      },
      outExtension() {
        return {
          js: '.js',
        }
      },
      async onSuccess() {
        console.log('SDK onSuccess!')
      },
    },
  ]
})
