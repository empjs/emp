import fs from 'node:fs/promises'
import {logger} from 'src/helper'
import {green} from 'src/helper/color'
import {getPorts} from 'src/helper/getPort'
import ipAddress from 'src/helper/ipAddress'
import openBrowser from 'src/helper/openBrowser'
import {getLanIp} from 'src/helper/utils'
import type {GlobalStore} from 'src/store'

export class StoreServer {
  public ip = getLanIp()
  public host = this.ip
  public isAutoDevBase = false
  public isHttps = false
  public httpsType: 'default' | 'h2' | 'h3' = 'default'
  public protocol = 'http'
  public port = 8000
  public store: GlobalStore
  public publicPath: any = '/'
  public publicHasHttp = false
  public isOpenBrower = false
  public url = ''
  public urls = {localUrlForBrowser: '', localUrlForTerminal: '', lanUrlForTerminal: '', lanUrlForConfig: ''}

  constructor(store: GlobalStore) {
    this.store = store
  }
  /**
   * 获取config后重新适配 server 配置信息
   */
  public async setupOnEmpOptionSync() {
    if (this.store.cliAction === 'build') {
      return
    }
    this.port = await getPorts(this.port)
    this.setHttps()
    await this.setAutoDevBase()
  }
  /**
   * 获取 server 所有配置信息
   */
  get config() {
    return {}
  }
  /**
   * setupOnEmpOptionSync 之后，store setup 之后
   */
  public async setupOnStore() {
    if (this.store.cliAction === 'build') {
      return
    }
    const {store} = this
    this.publicPath = store.rsConfig.output?.publicPath === 'auto' ? '/' : store.rsConfig.output?.publicPath || '/'
    this.isOpenBrower = !!store.empConfig.server.open
    this.protocol = this.isHttps ? 'https' : 'http'
    this.host = store.empConfig.server.host ? store.empConfig.server.host : this.ip
    if (store.empConfig.server.port && store.empConfig.server.port !== this.port) {
      this.port = await getPorts(store.empConfig.server.port)
    }
    ipAddress.setup(this)
    // 匹配 url
    if (this.publicPath && (this.publicPath.indexOf('http://') > -1 || this.publicPath.indexOf('https://') > -1)) {
      this.url = this.publicPath
      this.publicHasHttp = true
      this.urls.localUrlForTerminal = ipAddress.prettyPrintUrl('localhost')
    } else {
      this.urls = ipAddress.urls
      this.url = this.urls.localUrlForBrowser
    }
  }
  public startOpen() {
    const {urls} = this
    if (this.publicHasHttp) {
      logger.info(`${green('➜')} Local:   ${logger.link(urls.localUrlForTerminal)}`)
      logger.info(`${green('➜')} Network: ${logger.link(this.publicPath)}`)
    } else {
      logger.info(`${green('➜')} Local:   ${logger.link(urls.localUrlForTerminal)}`)
      logger.info(`${green('➜')} Network: ${logger.link(urls.lanUrlForTerminal)}\n`)
    }
    // check open brower
    if (this.isOpenBrower) openBrowser(this.url)
  }
  public async getcert() {
    const {store} = this
    const devServer: any = this.store.rsConfig.devServer || {server: {type: 'http'}}
    if (
      typeof devServer.server === 'object' &&
      devServer.server.type === 'https' &&
      devServer.server.options &&
      devServer.server.options.key &&
      devServer.server.options.cert
    ) {
      return devServer.server.options
    }
    const [key, cert] = await Promise.all([fs.readFile(store.resource.key), fs.readFile(store.resource.cert)])
    return {key, cert}
  }
  private setHttps() {
    const {store} = this
    const {server, https} = store.empOptions.server || {}
    this.isHttps = server === 'https' || (typeof server === 'object' && server.type === 'https') || https === true
  }
  private async setAutoDevBase() {
    const {store} = this
    this.isAutoDevBase = !!store.empOptions.autoDevBase && store.mode === 'development' && !this.isHttpBase
    if (!this.isAutoDevBase) return
    this.protocol = this.isHttps ? 'https' : 'http'
    if (store.empOptions.server?.port) {
      this.port = store.empOptions.server.port
    }
    this.port = await getPorts(this.port)
    const webSocketURL = `${this.isHttps ? 'wss' : 'ws'}://${this.host}:${this.port}/ws`
    store.empOptions.base = `${this.protocol}://${this.host}:${this.port}/`
    store.empOptions.server = store.deepAssign(
      {
        // host: host,//允许所有host 访问
        port: this.port,
        client: { webSocketURL },
      },
      store.empOptions.server,
    )
  }
  private get isHttpBase() {
    const base = this.store.empOptions.base || ''
    return base.indexOf('http://') > -1 || base.indexOf('https://') > -1
  }
}
