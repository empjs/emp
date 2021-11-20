import glob from 'fast-glob'
import store from 'src/helper/store'
import {Configuration} from 'webpack'
import path from 'path'
import wpChain from 'src/helper/wpChain'
import HtmlWebpackPlugin from 'html-webpack-plugin'
/**
 * multi entry
 * 多入口设置
 */
class WPEntries {
  entry: Configuration['entry'] | any = {}
  constructor() {}
  async setup() {
    await this.getEntry()
  }
  async getEntry() {
    const entrys = await glob(['src/index.ts', 'src/index.tsx', 'src/index.jsx', 'src/index.js'])
    const entry = entrys[0] || 'src/index.js'
    const extname = path.extname(entry)
    const entryKey: string = entry.replace(extname, '')
    this.entry[entryKey] = [entry]
    // console.log('this.entry', this.entry)
    wpChain.merge({entry: this.entry})
    this.setHtmlWebpackPlugin([entryKey])
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
      //
      // inject: false, //避免插入两个同样 js ::TODO 延展增加 node_modules
      //  filename: 'index.html',
      // isESM: store.isESM,
      files: {
        css: store.empShare.externalAssets.css,
        js: store.empShare.externalAssets.js,
      },
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
    wpChain.plugin('html').use(HtmlWebpackPlugin, [options])
  }
}

export default WPEntries
