import path from 'node:path'
import type {RspackOptions} from '@rspack/core'
import {glob, logger} from 'src/helper'
import type {GlobalStore} from 'src/store'
import type {EmpConfig} from 'src/store/empConfig'
import {HtmlWebpackPlugin} from 'src/store/rspack/builtInPlugin'
import type {InjectTagsType} from 'src/types/config'

type EntriesConfigType = {
  [chunk: string]: {
    html: EmpConfig['html']
    entry: RspackOptions['entry']
  }
}

class RspackEntries {
  public store!: GlobalStore
  public entriesConfig: EntriesConfigType = {}
  async setup(store: GlobalStore) {
    this.store = store
    await this.init()
    this.toConfig()
  }
  private setHtmlConfig(c: EmpConfig['html'], chunks: string[]) {
    c.template = this.setTemplate(c.template)
    c.favicon = this.setFavicion(c.favicon)
    c.chunks = chunks
    c.filename = `${chunks[0]}.html`
    if (this.store.empConfig.base) c.publicPath = this.store.empConfig.base
    // c.tags = c.tags || {}
    //
    // delete c.files
    // delete c.tags
    // delete c.lang
    this.prepareAndSetAsset(c)
    return c
  }
  private prepareAndSetAsset(c: EmpConfig['html']) {
    const chunk = c.chunks ? c.chunks[0] : undefined
    // console.log('prepareAndSetAsset', chunk, c.tags)
    this.store.injectTags(c.tags, chunk ? `injectTags-${chunk}` : 'injectTags', chunk)
    delete c.tags
  }
  /**
   * injectPolyfill 插入 polyfill 代码
   */
  private injectPolyfill() {
    if (!this.store.empConfig.build.polyfill.entryCdn) return
    const o: InjectTagsType = [
      {attributes: {src: this.store.empConfig.build.polyfill.entryCdn}, tagName: 'script', pos: 'head'},
    ]
    this.store.injectTags(o, 'injectEMPPolyfill')
  }
  /**
   * chunk name 格式化 去除 后缀
   * @param filename
   * @returns
   */
  private setChunk(filename: string) {
    return filename.replace(path.extname(filename), '').replace(`${this.store.empConfig.appSrc}${path.sep}`, '')
  }
  private setTemplate(template?: string) {
    return template ? this.store.resolve(template) : this.store.empResolve(path.join('template', 'index.html'))
  }
  private setFavicion(favicon?: string) {
    if (favicon === '') return undefined
    return favicon ? this.store.resolve(favicon) : this.store.empResolve(path.join('template', 'favicon.ico'))
  }
  /**
   *
   * @param filename 文件名
   * @param op html plugin 配置
   * @param absPath 文件 绝对路径
   */
  private setEntryItem(filename: string, op: EmpConfig['html'], absPath?: string) {
    absPath = absPath ? absPath : this.store.resolve(path.join(this.store.empConfig.appSrc, filename))
    const chunkName = this.setChunk(filename)
    const chunks = [absPath]
    this.entriesConfig[chunkName] = {
      entry: {[chunkName]: chunks},
      html: this.setHtmlConfig(op, [chunkName]),
    }
    // 入口注入到store 作为 chain 或者 after config 后使用
    this.store.entries[chunkName] = chunks
  }
  setRspackHtmlPlugin(config: EmpConfig['html'], chunk: string) {
    //html plugin run
    // config.chunks?.unshift('coreJs')
    // config.chunksSortMode = 'manual'
    // console.log(`setRspackHtmlPlugin ${chunk}`, config)
    this.store.chain.plugin(`${this.store.chainName.plugin.html.prefix}${chunk}`).use(HtmlWebpackPlugin, [config])
  }
  setRspackEntry(entry: RspackOptions['entry']) {
    this.store.merge({entry})
  }
  async init() {
    this.injectPolyfill()
    if (this.store.empConfig.autoPages) {
      await this.setAutoPage()
    } else {
      await this.setDefaultEntry()
      this.setEntryByConfig()
    }
  }
  async setAutoPage() {
    logger.time('setAutoPage')
    const pathFolder = this.store.empConfig.autoPages?.path || 'pages'
    const autoPath = path.join(this.store.appSrc, pathFolder)
    const exp = path.join(autoPath, '**', `*.{ts,tsx,jsx,js}`)
    let entries = await glob([exp], {windowsPathsNoEscape: true})
    entries = entries.map(d => d.replace(`${autoPath}${path.sep}`, ''))
    entries.map(filename => {
      const op = this.store.empConfig.entries[filename] || {}
      this.setEntryItem(filename, {...this.store.empConfig.html, ...op}, path.join(autoPath, filename))
    })
    logger.timeEnd('setAutoPage')
  }
  async setDefaultEntry() {
    const timeTag = 'store.empConfig.setDefaultEntry'
    logger.time(timeTag)
    const appEntry = path.join(
      this.store.appSrc,
      this.store.empConfig.appEntry ? this.store.empConfig.appEntry : `index.{ts,tsx,jsx,js}`,
    )
    const elist = await glob([appEntry], {windowsPathsNoEscape: true})
    if (elist[0]) {
      const filename = path.join(
        this.store.empConfig.appSrc,
        Object.keys(this.store.empConfig.entries).length > 0 && this.store.empConfig.appEntry
          ? this.store.empConfig.appEntry
          : 'index',
      )
      this.setEntryItem(filename, this.store.empConfig.html, elist[0])
    }
    logger.timeEnd(timeTag)
  }
  setEntryByConfig() {
    if (Object.keys(this.store.empConfig.entries).length > 0) {
      for (const [filename, op] of Object.entries(this.store.empConfig.entries)) {
        this.setEntryItem(filename, {...this.store.empConfig.html, ...op})
      }
    }
  }
  toConfig() {
    for (const [chunk, op] of Object.entries(this.entriesConfig)) {
      this.setRspackHtmlPlugin(op.html, chunk)
      this.setRspackEntry(op.entry)
    }
  }
}

export default new RspackEntries()
