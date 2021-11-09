import store from 'src/helper/store'
import fs from 'fs-extra'
class WpPluginOptions {
  public htmlWebpackPlugin
  public moduleFederation
  constructor() {
    this.htmlWebpackPlugin = this.setHtmlWebpackPlugin()
    this.moduleFederation = this.setModuleFederation()
  }
  private setModuleFederation() {
    let mf = {}
    const {moduleFederation, build} = store.config
    // console.log('moduleFederation', moduleFederation)
    if (moduleFederation) {
      moduleFederation.filename = moduleFederation.filename || 'emp.js'
      // emp esm module
      if (!moduleFederation.library && ['es3', 'es5'].indexOf(build.target) === -1) {
        // moduleFederation.library = {type: 'module'}
        // moduleFederation.library = {type: 'window', name: moduleFederation.name}
      }
      mf = moduleFederation
    }
    return mf
  }
  private setHtmlWebpackPlugin() {
    let template = store.resolve('src/index.html')
    // let favicon = store.resolve('src/favicon.ico')
    if (!fs.existsSync(template)) {
      template = store.empResolve('template/index.html')
    }
    /* if (!fs.existsSync(favicon)) {
      favicon = store.empResolve('template/favicon.ico')
    } */
    return {
      title: 'EMP',
      template,
      chunks: ['index'],
      // favicon: false,/disable favicion
      //
      // inject: false, //避免插入两个同样 js ::TODO 延展增加 node_modules
      /* filename: 'index.html',
      files: {
        css: [],
        js: [],
      }, */
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
