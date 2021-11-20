import store from 'src/helper/store'
import {cliOptionsType} from 'src/types'
class WpPluginOptions {
  public htmlWebpackPlugin = {}
  public definePlugin = {}
  public dotenv = {}

  constructor() {}
  public async setup() {
    this.htmlWebpackPlugin = this.setHtmlWebpackPlugin()
    this.definePlugin = this.setDefinePlugin()
    // this.moduleFederation = await getModuleFederation()
    this.dotenv = this.setDotenv()
  }
  private setDotenv() {
    const env = store.cliOptions.env || store.config.mode
    const config = {
      path: store.resolve(`.env${env ? '.' + env : ''}`),
      // path: './some.other.env', // load this now instead of the ones in '.env'
      safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: true, // hide any errors
      defaults: false, // load '.env.defaults' as the default values if empty.
    }
    return config
  }
  private setDefinePlugin() {
    const clist: cliOptionsType = store.cliOptions
    clist.mode = store.config.mode
    const defines: cliOptionsType = {}

    Object.keys(clist).map(key => {
      if (store.isESM && store.config.useImportMeta) defines[`import.meta.env.${key}`] = JSON.stringify(clist[key])
      else defines[`process.env.${key}`] = JSON.stringify(clist[key])
    })
    return defines
  }
  /**
   * 自定义内容移到 config里面 方便外部自定义
   */
  private setHtmlWebpackPlugin() {
    if (store.config.html.files) {
      if (store.config.html.files.css) {
        store.empShare.externalAssets.css = store.empShare.externalAssets.css.concat(store.config.html.files.css)
      }
      if (store.config.html.files.js) {
        store.empShare.externalAssets.js = store.empShare.externalAssets.js.concat(store.config.html.files.js)
      }
      //避免 merge 影响全局加载
      delete store.config.html.files
    }
    return {
      // title: 'EMP',
      // template,
      chunks: ['index'],
      // favicon,
      //
      // inject: false, //避免插入两个同样 js ::TODO 延展增加 node_modules
      //  filename: 'index.html',
      // isESM: store.isESM,
      files: {
        css: store.empShare.externalAssets.css,
        js: store.empShare.externalAssets.js,
      },
      scriptLoading: !store.isESM ? 'defer' : 'module',
      minify: store.wpo.mode === 'production' && {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      ...store.config.html,
    }
  }
}

export default WpPluginOptions
