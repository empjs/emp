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
    // 不允许 template 放到 public
    this.checkTemplateInPublic()
    //
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
    let entry = ''
    if (!store.config.appEntry) {
      const elist = await glob([`${store.config.appSrc}/index.{ts,tsx,jsx,js}`])
      if (!elist[0]) {
        throw new Error('找不到入口文件!')
      }
      entry = elist[0]
    } else {
      entry = `${store.config.appSrc}/${store.config.appEntry}`
    }
    const extname = path.extname(entry)
    const chunk: string = entry.replace(extname, '').replace(`${store.config.appSrc}/`, '')
    //
    this.entry[chunk] = [store.resolve(entry)]
    this.wpConfig.entry = this.entry
  }
  private checkTemplateInPublic() {
    const {favicon, template} = store.config.html
    const faviconAbs = path.dirname(favicon || '')
    const templateAbs = path.dirname(template || '')
    if (faviconAbs.includes(store.publicDir) || templateAbs.includes(store.publicDir)) {
      throw new Error('Template 与 favicon 不能放到./public,推荐放到 ./src or ./template')
    }
  }
  private setHtmlWebpackPlugin(chunks: string[] = ['index']) {
    store.config.html.files.css = store.config.html.files.css.concat(store.empShare.externalAssets.css)
    if (!store.isESM) store.config.html.files.js = store.config.html.files.js.concat(store.empShare.externalAssets.js)

    const options: HtmlWebpackPlugin.Options = {
      // title: 'EMP',
      // template,
      chunks,
      // favicon,
      // inject: false, //避免插入两个同样 js ::TODO 延展增加 node_modules
      //  filename: 'index.html',
      // isESM: store.isESM,
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
    if (store.config.base && !options.publicPath) {
      options.publicPath = store.config.base
    }
    // wpChain.plugin(`html_plugin_${chunks}`).use(HtmlWebpackPlugin, [options])
    this.wpConfig.plugin[`html_plugin_${chunks}`] = {
      plugin: HtmlWebpackPlugin,
      args: [options],
    }
  }
}

export default WPEntries
