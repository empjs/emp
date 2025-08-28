import type {GlobalStore} from '@empjs/cli'
import {VueLoaderPlugin} from '@empjs/vue-loader'
//
export default () => {
  return {
    name: '@empjs/plugin-vue3',
    async rsConfig(store: GlobalStore) {
      const {chain} = store
      //
      // store.merge({
      //   experiments: {
      //     rspackFuture: {
      //       newTreeshaking: true, // 该功能启用了与 webpack 相同的新摇树优化实现，可以生成更高效和更小的代码。
      //     },
      //   },
      // })
      //
      // reset
      // chain.module.rule('javascript').uses.clear().end()
      // chain.module.rule('typescript').uses.clear().end()
      chain.module.rule('javascript').test(/\.js$/)
      chain.module.rule('typescript').test(/\.ts$/)
      // plugin
      chain.plugin('vue-loader-plugin').use(VueLoaderPlugin, [])
      // module
      const options: any = {
        compilerOptions: {
          preserveWhitespace: false,
        },
        experimentalInlineMatchResource: true,
        // hotReload: false, // 关闭热重载
        // exposeFilename: false,
        // library: store.empConfig.empShareLib.config.name,
      }
      const library = `${store.uniqueName}_emp_hmr_${store.empConfig.server.port || 'default'}`
      //
      options.library = library

      chain.module
        .rule('vue-loader')
        .test(/\.vue$/)
        .use('vue-loader')
        .loader(require.resolve('@empjs/vue-loader'))
        .options(options)
        .end()
      //jsx and tsx compile
      chain.module
        .rule('vue-jtsx')
        // .test(/\.(js|jsx|ts|tsx)$/)
        .test(/\.(jsx|tsx)$/)
        .use('babel-loader')
        .loader(require.resolve('babel-loader'))
        .options({
          presets: [
            [
              require.resolve('@babel/preset-typescript'),
              {
                isTSX: true, // allExtensions依赖isTSX  https://babeljs.io/docs/en/babel-preset-typescript#allextensions
                allExtensions: true, // 支持所有文件扩展名
              },
            ],
          ],
          plugins: [[require.resolve('@vue/babel-plugin-jsx'), {optimize: true}]],
        })
        .end()
      // define
      store.chain.plugin('definePlugin').tap((args: any) => {
        // https://link.vuejs.org/feature-flags
        const o = {
          __VUE_OPTIONS_API__: true,
          __VUE_PROD_DEVTOOLS__: false,
          __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
        }
        args[0] = {
          ...o,
          ...args[0],
        }
        return args
      })
      // chain config
      store.chain.merge({
        module: {
          rule: {
            svg: {
              type: 'asset/resource',
            },
            // vue js and ts compile
            // vuejs: {
            //   test: /\.(js|ts)$/,
            //   exclude: store.empConfig.moduleTransformRule,
            //   sideEffects: false, // 标记模块是否存在副作用。
            //   use: [
            //     {
            //       loader: 'builtin:swc-loader',
            //       options: {
            //         jsc: {
            //           parser: {
            //             syntax: 'typescript',
            //             decorators: true,
            //             tsx: true,
            //             dynamicImport: true,
            //           },
            //         },
            //       },
            //     },
            //   ],
            // },
          },
        },
      })
    },
  }
}
/**
 * @vue/compiler-sfc
 * Note: as of 3.2.13+, this package is included as a dependency of the main vue package and can be accessed as vue/compiler-sfc.
 * This means you no longer need to explicitly install this package and ensure its version match that of vue's.
 * Just use the main vue/compiler-sfc deep import instead.
 */
