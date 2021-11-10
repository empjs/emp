import store from 'src/helper/store'
import fs from 'fs-extra'
import {cliOptionsType} from 'src/types'
class WpPluginOptions {
  public htmlWebpackPlugin
  public moduleFederation
  public definePlugin
  private isESM = ['es3', 'es5'].indexOf(store.config.build.target) === -1
  constructor() {
    this.htmlWebpackPlugin = this.setHtmlWebpackPlugin()
    this.moduleFederation = this.setModuleFederation()
    this.definePlugin = this.setDefinePlugin()
  }
  private setDefinePlugin() {
    const defines: cliOptionsType = {}
    defines.mode = store.config.mode
    const setDefineEnv = (d: cliOptionsType) => {
      Object.keys(d).map(key => {
        if (!this.isESM) defines[`process.env.${key}`] = JSON.stringify(d[key])
        else defines[`import.meta.env.${key}`] = JSON.stringify(d[key])
      })
    }
    setDefineEnv(defines)
    return defines
  }
  private setModuleFederation() {
    let mf = {}
    const {moduleFederation} = store.config
    if (moduleFederation) {
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
    let template = store.resolve('src/index.html')
    let favicon = store.resolve('src/favicon.ico')
    if (!fs.existsSync(template)) {
      template = store.empResolve('template/index.html')
    }
    if (!fs.existsSync(favicon)) {
      favicon = store.empResolve('template/favicon.ico')
    }
    return {
      title: 'EMP',
      template,
      chunks: ['index'],
      favicon,
      //
      // inject: false, //避免插入两个同样 js ::TODO 延展增加 node_modules
      //  filename: 'index.html',
      files: {
        css: store.wpo.externalAssets.css,
        js: store.wpo.externalAssets.js,
      },
      scriptLoading: ['es3', 'es5'].indexOf(store.config.build.target) > -1 ? 'defer' : 'module',
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
    }
  }
}

export default WpPluginOptions
