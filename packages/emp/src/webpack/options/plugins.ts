import store from 'src/helper/store'
import fs from 'fs-extra'
class WpPluginOptions {
  public htmlWebpackPlugin
  constructor() {
    this.htmlWebpackPlugin = this.setHtmlWebpackPlugin()
  }
  setHtmlWebpackPlugin() {
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
      // favicon: false,/disable favicion
      //
      // inject: false, //避免插入两个同样 js ::TODO 延展增加 node_modules
      /* filename: 'index.html',
      chunks: ['index'],
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
