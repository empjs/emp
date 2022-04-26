import store from 'src/helper/store'
import path from 'path'
import wpChain from 'src/helper/wpChain'
import loader, {parserType} from 'src/webpack/loader'
import babelLoader from './loader/babel-loader'
import swcLoader from './loader/swc-loader'
// import fs from 'fs-extra'
type ReactRuntimeType = 'automatic' | 'classic'
class WPModule {
  reactRuntime?: ReactRuntimeType = undefined
  constructor() {}
  async setup() {
    this.setConfig()
    this.setScriptReactLoader()
    this.setWebworker()
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
            // exclude: /(node_modules|bower_components)/, //不能加 exclude 否则会专程 arrow
            exclude: store.config.moduleTransformExclude,
            use: {
              // swc: {
              //   loader: store.empResolve(path.resolve(store.empSource, 'webpack/loader/swc')),
              //   options: store.config.build,
              // },
              ...loader(),
            },
          },
          // webworker: this.webworker,
        },
      },
    }
    wpChain.merge(config)
  }
  private setWebworker() {
    const workerInline = wpChain.module
      .rule('webworker')
      .oneOf('workerInline')
      .resourceQuery(/worker/)
    //
    workerInline
      .use('workerLoader')
      .loader(require.resolve('worker-loader'))
      .options({
        inline: 'no-fallback',
        filename: '[name].[contenthash].worker.js',
      })
      .end()
    // 解决ts 不能正常构建的问题
    // .use('swc')
    // .loader(store.empResolve(path.resolve(store.empSource, 'webpack/loader/swc')))
    // .options(store.config.build)
    // .end()
    // 解决ts 不能正常构建的问题
    const type = parserType()
    if (type === 'swc' || type === 'babel') {
      let parserLoader: any = loader()
      parserLoader = parserLoader[type]
      workerInline.use(type).loader(parserLoader.loader).options(parserLoader.options).end()
    }
  }
  private setScriptReactLoader() {
    const isDev = store.config.mode === 'development'
    const pkg = store.pkg
    pkg.dependencies = pkg.dependencies || {}
    pkg.devDependencies = pkg.devDependencies || {}
    const reactVersion = pkg.dependencies.react || pkg.devDependencies.react
    //const isAntd = pkg.dependencies.antd || pkg.devDependencies.antd ? true : false
    // 增加插件支持
    // if (isDev && store.config.server.hot && !!store.config.reactRuntime)
    if (isDev && store.config.server.hot && !!store.config.reactRuntime && reactVersion) {
      wpChain.plugin('reactRefresh').use(require('@pmmmwh/react-refresh-webpack-plugin'), [
        {
          overlay: false, // 切换到默认overlay
        },
      ])
    }
  }
}
export default WPModule
