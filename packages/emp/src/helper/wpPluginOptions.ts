import globalVars from './globalVars'

class WpPluginOptions {
  public htmlWebpackPlugin
  constructor() {
    this.htmlWebpackPlugin = this.setHtmlWebpackPlugin()
  }
  setHtmlWebpackPlugin() {
    return {
      title: 'EMP',
      template: globalVars.empResolve('template/public/index.html'),
      favicon: globalVars.empResolve('template/public/favicon.ico'),
      chunks: ['index'],
      files: {
        css: [],
        js: [],
      },
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
