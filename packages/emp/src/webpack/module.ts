import logger from 'src/helper/logger'
import store from 'src/helper/store'
import wpChain from 'src/helper/wpChain'
import loader, {LoaderType} from 'src/webpack/loader'
class WPModule {
  loader!: LoaderType
  constructor() {}
  async setup() {
    this.loader = loader()
    logger.debug(`[js compile in ${this.loader.type || 'babel'}]`, this.loader.loader.options.build)
    this.setConfig()
    this.setScriptReactLoader()
    this.setWebworker()
  }
  private setConfig() {
    const {parser} = this
    const config = {
      module: {
        parser,
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
            // test: /\.(js|mjs|jsx|ts|tsx)$/,
            // include: [store.appSrc],
            use: {
              ...this.loader.config,
            },
          },
          // webworker: this.webworker,
        },
      },
    }
    wpChain.merge(config)
  }
  private get parser() {
    return {
      javascript: {
        exportsPresence: 'error',
        importExportsPresence: 'error',
      },
    }
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
    workerInline.use(this.loader.type).loader(this.loader.loader.loader).options(this.loader.loader.options).end()
  }
  private setScriptReactLoader() {
    const isDev = store.config.mode === 'development'

    // 增加插件支持
    if (isDev && store.config.server.hot && !!store.config.reactRuntime && store.config.reactVersion) {
      const op: any = {
        overlay: false, // 切换到默认overlay
      }
      if (store.empShare.moduleFederation.name) {
        op.library = store.empShare.moduleFederation.name
      }
      const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
      wpChain.plugin('reactRefresh').use(ReactRefreshPlugin, [op])
    }
  }
}
export default WPModule
