import type {GlobalStore} from '@empjs/cli'
import type {PluginReactConfigType, PluginReactType} from './types'

//
export default (o: PluginReactType = {}) => {
  return {
    name: '@empjs/plugin-react',
    async rsConfig(store: GlobalStore) {
      const {chain, deepAssign} = store
      //
      if (store.empConfig.server.hot === false) {
        o.hmr = false
      }
      if (o.hmr === false) {
        store.empConfig.server.hot = false
      }
      //
      o = deepAssign({hmr: true, svgrQuery: 'react', splickChunks: false}, o)
      //
      let reactVersion = `18.0.0`
      if (o.version) {
        reactVersion = `${o.version}`
      } else if (store.pkg.dependencies.react || store.pkg.devDependencies.react) {
        reactVersion = store.pkg.dependencies.react || store.pkg.devDependencies.react
      }
      if (o.import) {
        store.injectTags([
          {
            attributes: {
              src: o.import.src,
            },
            tagName: 'script',
          },
        ])
        if (o.import.externals) {
          chain.merge({
            externals: o.import.externals,
          })
        }
      }
      //
      function getReactRuntime() {
        if (!reactVersion) return o.reactRuntime
        return o.reactRuntime ? o.reactRuntime : store.vCompare(reactVersion, '17') > -1 ? 'automatic' : 'classic'
      }
      const reactRuntime = getReactRuntime()
      /** ======================
       * swc transform 配置
       * =======================
       */
      const transform = {
        react: {
          runtime: reactRuntime,
          development: store.isDev,
          refresh: store.isDev && o.hmr,
        },
      }
      const resetTransform = (op: any) => {
        op.jsc.transform = deepAssign(op.jsc.transform, transform)
        return op
      }
      //
      chain.module.rule('javascript').use('swc').tap(resetTransform)
      chain.module.rule('typescript').use('swc').tap(resetTransform)
      /** ======================
       * swc hmr 配置
       * =======================
       */
      if (store.isDev && o.hmr) {
        // React Refresh插件配置选项 (基于rspack-plugin-react-refresh类型定义)
        const library = `${store.uniqueName}_emp_hmr_${store.empConfig.server.port || 'default'}`
        // console.log('emp plugin library', library)
        const op: PluginReactConfigType = {
          include: [/\.(?:js|jsx|mjs|cjs|ts|tsx|mts|cts)$/],
          exclude: [/node_modules/, /\.css$/, /__federation_expose.*\.js$/],
          // 禁用错误覆盖层以避免与模块联邦冲突
          // overlay: false,
          // 使用模块联邦的唯一名称作为library
          library,
          // injectEntry: false,
          // injectLoader: false,
          reloadOnRuntimeErrors: true,
        }

        store.chain.plugin('plugin-react-refresh').use(require.resolve('@rspack/plugin-react-refresh'), [op])
      }
      /** ======================
       * swc svgr 配置
       * =======================
       */
      chain.module.rule('svg').delete('type')
      //
      const exp = new RegExp(`${o.svgrQuery}`)
      store.chain.merge({
        module: {
          rule: {
            svg: {
              test: /\.svg$/,
              oneOf: [
                {
                  issuer: /\.[jt]sx?$/,
                  resourceQuery: exp,
                  use: [
                    {
                      loader: require.resolve('@svgr/webpack'),
                      options: {},
                    },
                  ],
                },
                {
                  resourceQuery: {not: [exp]},
                  type: 'asset/resource',
                },
              ],
            },
          },
        },
      })
      //
      if (o.splickChunks) {
        store.chain.optimization.merge({
          splitChunks: {
            cacheGroups: {
              react: {
                name: 'common-react',
                test: !store.isDev
                  ? /node_modules[\\/](?:react|react-dom|scheduler)[\\/]/
                  : /node_modules[\\/](?:react|react-dom|scheduler|react-refresh|@rspack[\\/]plugin-react-refresh)[\\/]/,
                priority: 0,
                // chunks: 'all',
              },
              reactRouter: {
                name: 'common-react-router',
                test: /node_modules[\\/](?:react-router|react-router-dom|history|@remix-run[\\/]router)[\\/]/,
                priority: 0,
                // chunks: 'all',
              },
            },
          },
        })
      }
    },
  }
}
