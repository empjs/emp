import store from 'src/helper/store'
import path from 'path'
import wpChain from 'src/helper/wpChain'
import fs from 'fs-extra'
type ReactRuntimeType = 'automatic' | 'classic'
class WPModule {
  reactRuntime?: ReactRuntimeType
  constructor() {}
  async setup() {
    this.setConfig()
    this.setScriptReactLoader()
  }
  private setConfig() {
    const config = {
      module: {
        // mini-css-extract-plugin 编译不过！
        /* generator: {
          asset: {
            publicPath: store.config.base,//:TODO 验证 publicPath auto 需要设置 '/' or ''
          },
        }, */
        rule: {
          // 解决 mjs 加载失败问题
          mjs: {
            test: /\.m?js/,
            resolve: {
              fullySpecified: false,
            },
          },
          //
          scripts: {
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: /(node_modules|bower_components)/, //不能加 exclude 否则会专程 arrow
            use: {
              swc: {
                loader: store.empResolve(path.resolve(store.empSource, 'webpack/loader/swc')),
                options: store.config.build,
              },
            },
          },
        },
      },
    }
    wpChain.merge(config)
  }

  private setScriptReactLoader() {
    const isDev = store.config.mode === 'development'
    //const isAntd = pkg.dependencies.antd || pkg.devDependencies.antd ? true : false
    // 增加插件支持
    if (isDev && store.config.server.hot && !!store.config.reactRuntime)
      wpChain.plugin('reactRefresh').use(require('@pmmmwh/react-refresh-webpack-plugin'))
  }
}
export default WPModule
