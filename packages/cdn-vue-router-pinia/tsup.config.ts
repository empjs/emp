import {defineConfig, type Options} from 'tsup'

function getOptions(env: 'development' | 'production', watch = false): Options {
  return {
    entry: ['src/vue.ts', 'src/vueRouter.ts'],
    format: ['iife'],
    target: 'es2018',
    sourcemap: !!watch,
    clean: true,
    dts: true,
    globalName: 'EMP_ADAPTER_VUE',
    env: {NODE_ENV: env},
    minify: env !== 'development' ? 'terser' : false,
    // minify: env !== 'development' ? true : false,
    shims: false, // 禁用 tsup 内置 shims，这是最重要的
    platform: 'browser', // 明确指定浏览器平台
    bundle: true, // 确保完全打包
    watch: !!watch,
    esbuildOptions(options, context) {
      options.legalComments = 'none'
      // 添加alias配置优化模块路径解析
      options.alias = {
        vue: `./node_modules/vue/dist/vue.runtime.esm-browser${env === 'production' ? '.prod' : ''}.js`,
        'vue-router': `./node_modules/vue-router/dist/vue-router.esm-browser${env === 'production' ? '.prod' : ''}.js`,
        // pinia: './node_modules/pinia/dist/pinia.esm-browser.js',
      }
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
