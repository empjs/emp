import type {GlobalStore} from '@empjs/cli'
import {VueLoaderPlugin} from 'vue-loader'
//
export default () => {
  return {
    name: '@empjs/plugin-vue2',
    async rsConfig(store: GlobalStore) {
      const {chain} = store
      // store.merge({
      //   experiments: {
      //     rspackFuture: {
      //       newTreeshaking: true, // 该功能启用了与 webpack 相同的新摇树优化实现，可以生成更高效和更小的代码。
      //     },
      //   },
      // })
      //
      chain.resolve.alias.set('vue$', 'vue/dist/vue.runtime.esm.js')
      chain.plugin('vue-loader-plugin').use(VueLoaderPlugin, [])
      // chain.module.rule('javascript').uses.clear().end()
      // chain.module.rule('typescript').uses.clear().end()
      chain.module.rule('javascript').test(/\.js$/)
      chain.module.rule('typescript').test(/\.ts$/)
      //
      chain.module
        .rule('vue-loader')
        .test(/\.vue$/)
        .use('vue-loader')
        .loader(require.resolve('vue-loader'))
        .options({
          library: store.pkg.name,
          compilerOptions: {
            preserveWhitespace: false,
          },
          experimentalInlineMatchResource: true,
        })
        .end()
        .use('vue-svg-inline-loader')
        .loader(require.resolve('vue-svg-inline-loader'))
        .end()
      //
      chain.module
        .rule('vue-jtsx')
        .test(/\.(jsx|tsx)$/)
        .use('babel-loader')
        .loader(require.resolve('babel-loader'))
        .options({
          presets: [
            [
              require.resolve('@vue/babel-preset-jsx'),
              {
                compositionAPI: true,
                injectH: true,
                vModel: false,
              },
            ],
          ],
        })
        .end()
      store.chain.merge({
        module: {
          rule: {
            svg: {
              type: 'asset/resource',
            },
          },
          // lib: {
          //   use: [
          //     {
          //       loader: 'builtin:swc-loader',
          //       options: {
          //         rspackExperiments: {
          //           import: [
          //             {
          //               libraryName: 'element-ui',
          //               styleLibraryDirectory: 'lib/theme-chalk',
          //             },
          //             {
          //               libraryName: 'unilumin-ui',
          //               styleLibraryDirectory: 'lib/style',
          //             },
          //           ],
          //         },
          //       },
          //     },
          //   ],
          // },
        },
      })
      //
    },
  }
}
