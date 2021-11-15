import store from 'src/helper/store'
import fs from 'fs-extra'
import {cliOptionsType} from 'src/types'
import {MFOptions} from 'src/config'
class WpPluginOptions {
  public htmlWebpackPlugin = {}
  public moduleFederation: MFOptions = {}
  public definePlugin = {}
  public dotenv = {}
  private isESM = false
  constructor() {}
  public async setup() {
    this.isESM = store.isESM
    this.htmlWebpackPlugin = this.setHtmlWebpackPlugin()
    this.definePlugin = this.setDefinePlugin()
    this.moduleFederation = await this.setModuleFederation()
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
      if (this.isESM && store.config.useImportMeta) defines[`import.meta.env.${key}`] = JSON.stringify(clist[key])
      else defines[`process.env.${key}`] = JSON.stringify(clist[key])
    })

    // console.log('defines', defines)
    return defines
  }
  private async setModuleFederation() {
    let mf: MFOptions = {}
    let {moduleFederation} = store.config
    if (moduleFederation) {
      if (typeof moduleFederation === 'function') {
        moduleFederation = await moduleFederation(store.config)
      }
      moduleFederation.filename = moduleFederation.filename || 'emp.js'
      // emp esm module
      if (!moduleFederation.library && this.isESM) {
        //TODO: 实验 MF 的 ESM 模式是否正常运行
        // moduleFederation.library = {type: 'module'}
        // moduleFederation.library = {type: 'window', name: moduleFederation.name}
      }
      mf = moduleFederation
    }
    return mf
  }
  private setHtmlWebpackPlugin() {
    /* let template = store.resolve('src/index.html')
    let favicon = store.resolve('src/favicon.ico')
    if (!fs.existsSync(template)) {
      template = store.empResolve('template/index.html')
    }
    if (!fs.existsSync(favicon)) {
      favicon = store.empResolve('template/favicon.ico')
    } */
    if (store.config.html.files) {
      if (store.config.html.files.css) {
        store.wpo.externalAssets.css.concat(store.config.html.files.css)
      }
      if (store.config.html.files.js) {
        store.wpo.externalAssets.js.concat(store.config.html.files.js)
      }
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
      files: {
        css: store.wpo.externalAssets.css,
        js: store.wpo.externalAssets.js,
      },
      scriptLoading: store.isESM ? 'defer' : 'module',
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
