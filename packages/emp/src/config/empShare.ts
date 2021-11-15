import {EMPConfig} from './index'
import {container, Configuration} from 'webpack'
import store from 'src/helper/store'
import {externalAssetsType} from 'src/types'
import {ResovleConfig} from '..'
//
export type MFOptions = ConstructorParameters<typeof container.ModuleFederationPlugin>[0]
type MFFunction = (o: EMPConfig) => MFOptions | Promise<MFOptions>
export type MFExport = MFOptions | MFFunction
//
export type ExternalsItemType = {
  /**
   * 模块名
   * @example react-dom
   */
  module?: string
  /**
   * 全局变量
   * @example ReactDom
   */
  global?: string
  /**
   * 入口地址
   * @example http://
   */
  entry: string
  /**
   * 类型入口
   * @default js
   * @enum js | css
   * @example css
   */
  type?: string
}
export type ExternalsFunc = (config: ResovleConfig) => ExternalsItemType[] | Promise<ExternalsItemType[]>
export type ExternalsType = ExternalsItemType[] | ExternalsFunc

class EMPShare {
  moduleFederation: MFOptions = {}
  externals: Configuration['externals'] | any = {}
  externalAssets: externalAssetsType = {js: [], css: []}
  constructor() {}
  async setup() {
    await Promise.all([this.setExternals(), this.setModuleFederation()])
  }
  async setExternals(): Promise<void> {
    if (store.config.externals) {
      let list = []
      if (typeof store.config.externals === 'function') {
        list = await store.config.externals(store.config)
      } else {
        list = store.config.externals
      }
      list.map(v => {
        v.type = v.type || 'js'
        if (v.type === 'js' && v.module) {
          this.externals[v.module] = v.global
          this.externalAssets.js.push(v.entry)
        } else if (v.type === 'css') {
          this.externalAssets.css.push(v.entry)
        }
      })
    }
  }
  async setModuleFederation() {
    let {moduleFederation} = store.config
    if (moduleFederation) {
      if (typeof moduleFederation === 'function') {
        moduleFederation = await moduleFederation(store.config)
      }
      moduleFederation.filename = moduleFederation.filename || 'emp.js'
      // emp esm module
      if (!moduleFederation.library && store.isESM) {
        //TODO: 实验 MF 的 ESM 模式是否正常运行
        // moduleFederation.library = {type: 'module'}
        // moduleFederation.library = {type: 'window', name: moduleFederation.name}
      }
      this.moduleFederation = moduleFederation
    }
  }
}
export default EMPShare
