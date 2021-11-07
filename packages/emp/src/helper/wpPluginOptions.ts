import globalVars from './globalVars'
import fs from 'fs-extra'
class WpPluginOptions {
  public htmlWebpackPlugin
  constructor() {
    this.htmlWebpackPlugin = this.setHtmlWebpackPlugin()
  }
  setHtmlWebpackPlugin() {
    let template = globalVars.resolve('src/index.html')
    let favicon = globalVars.resolve('src/favicon.ico')
    if (!fs.existsSync(template)) {
      template = globalVars.empResolve('template/index.html')
    }
    if (!fs.existsSync(favicon)) {
      favicon = globalVars.empResolve('template/favicon.ico')
    }
    return {
      title: 'EMP',
      template,
      favicon,
      // filename: 'index.html',
      // chunks: ['index'],
      /* files: {
        css: [],
        js: [],
      }, */
      minify: globalVars.wpEnv === 'production' && {
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

export default new WpPluginOptions()
