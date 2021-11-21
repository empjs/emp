import glob from 'fast-glob'
import store from 'src/helper/store'
import path from 'path'
import wpChain from 'src/helper/wpChain'
import HtmlWebpackPlugin from 'html-webpack-plugin'
/**
 * multi entry
 * 多入口设置
 */
class WPEntries {
  entry: any = {}
  wpConfig: any = {entry: {}, plugin: {}}
  constructor() {}
  async setup() {
    await this.singleEntry()
    wpChain.merge(this.wpConfig)
  }
  async singleEntry() {
    await this.setEntry()
    for (const [chunk, entry] of Object.entries(this.entry)) {
      this.setHtmlWebpackPlugin([chunk])
    }
  }
  async setEntry() {
    const elist = await glob([`${store.config.appSrc}/index.{ts,tsx,jsx,js}`])
    if (!elist[0]) {
      throw new Error('找不到入口文件!')
    }
    const entry = elist[0]
    const extname = path.extname(entry)
    const chunk: string = entry.replace(extname, '').replace(`${store.config.appSrc}/`, '')
    this.entry[chunk] = [entry]
    // console.log('this.entry', this.entry)
    this.wpConfig.entry = this.entry
    // this.setHtmlWebpackPlugin([entryKey])
  }
  private setHtmlWebpackPlugin(chunks: string[] = ['index']) {
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
    const options: HtmlWebpackPlugin.Options = {
      // title: 'EMP',
      // template,
      chunks,
      // favicon,
      // inject: false, //避免插入两个同样 js ::TODO 延展增加 node_modules
      //  filename: 'index.html',
      // isESM: store.isESM,
      files: {
        css: store.empShare.externalAssets.css,
        js: store.empShare.externalAssets.js,
      },
      publicPath: store.config.base,
      scriptLoading: !store.isESM ? 'defer' : 'module',
      minify: store.config.mode === 'production' && {
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
    // wpChain.plugin(`html_plugin_${chunks}`).use(HtmlWebpackPlugin, [options])
    this.wpConfig.plugin[`html_plugin_${chunks}`] = {
      plugin: HtmlWebpackPlugin,
      args: [options],
    }
  }
}

export default WPEntries
