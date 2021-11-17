import {EMPConfig} from './index'
import {container, Configuration} from 'webpack'
import store from 'src/helper/store'
import {externalAssetsType} from 'src/types'
import {ResovleConfig} from './index'
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
   * 不填则可以通过 emp-config 里的 html.files.js[url] 传入合并后的请求
   * 如 http://...?react&react-dom&react-router&mobx
   * @example http://
   */
  entry?: string
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
//
export type EMPshareLibItemType = {
  [module: string]:
    | {
        entry: string
        global?: string
        type?: 'js' | 'css'
      }
    | string
    | string[]
}
export type EMPShareType = MFOptions & {
  /**
   * emp 基于库共享模块
   */
  shareLib?: EMPshareLibItemType
}
export type EMPShareFunc = (config: ResovleConfig) => EMPShareType | Promise<EMPShareType>
export type EMPShareExport = EMPShareType | EMPShareFunc
class EMPShare {
  moduleFederation: MFOptions = {}
  externals: Configuration['externals'] | any = {}
  externalAssets: externalAssetsType = {js: [], css: []}
  // empShare: EMPShareType = {}
  constructor() {}
  async setup() {
    if (store.config.empShare) {
      await this.setEmpShare()
    } else {
      await Promise.all([this.setExternals(), this.setModuleFederation()])
    }
  }
  private async setEmpShare() {
    let mf: EMPShareType = {}
    if (typeof store.config.empShare === 'function') {
      mf = await store.config.empShare(store.config)
    } else if (store.config.empShare) {
      mf = store.config.empShare
    }
    const externals: ExternalsItemType[] = []
    if (typeof mf.shareLib === 'object') {
      for (const [k, v] of Object.entries(mf.shareLib)) {
        let externalsItem: ExternalsItemType = {}
        externalsItem.module = k
        if (typeof v === 'string') {
          const cb: any = v.match(/^([a-zA-Z\s]+)@(.*)/)
          externalsItem.global = cb[1]
          externalsItem.entry = cb[2]
          externalsItem.type = 'js'
          externals.push(externalsItem)
          externalsItem = {}
        } else if (Array.isArray(v)) {
          v.map(vo => {
            if (!vo) return
            const isJS = vo.split('?')[0].endsWith('.js')
            // console.log('vo', vo)
            // const isCSS = vo.split('?')[0].endsWith('.css')
            // if (!isJS && !isCSS) return
            if (isJS) {
              const cb: any = vo.match(/^([a-zA-Z\s]+)@(.*)/)
              externalsItem.global = cb[1]
              externalsItem.entry = cb[2]
              externalsItem.type = 'js'
            } else if (vo) {
              externalsItem.entry = vo
              externalsItem.type = 'css'
            }
            externals.push(externalsItem)
            externalsItem = {}
          })
        } else if (typeof v === 'object' && v.entry) {
          externalsItem.entry = v.entry
          externalsItem.global = v.global
          externalsItem.type = v.type
          externals.push(externalsItem)
          externalsItem = {}
        }
      }
      delete mf.shareLib
      await Promise.all([this.setExternals(externals), this.setModuleFederation(mf)])
    }
  }
  /**
   * setExternals
   * concat empShare's externals
   * @param externals
   */
  private async setExternals(externals: ExternalsItemType[] = []): Promise<void> {
    const externalsOpt = store.config.externals || []
    if (externalsOpt || externals.length > 0) {
      let list: ExternalsItemType[] = []
      if (typeof externalsOpt === 'function') {
        list = await externalsOpt(store.config)
      } else if (externalsOpt.length > 0) {
        list = externalsOpt
      }
      list = list.concat(externals)
      list.map(v => {
        v.type = v.type || 'js'
        if (v.type === 'js' && v.module) {
          this.externals[v.module] = v.global
          // 可以不传入 entry 利用传统的 merge request 进行合并请求
          if (v.entry) this.externalAssets.js.push(v.entry)
        } else if (v.type === 'css' && v.entry) {
          this.externalAssets.css.push(v.entry)
        }
      })
    }
  }
  /**
   * setModuleFederation
   * empshare Replace module federation options
   * @param moduleFederation
   */
  private async setModuleFederation(moduleFederation?: MFOptions) {
    let moduleFederationOpt = moduleFederation || store.config.moduleFederation
    if (moduleFederationOpt) {
      if (typeof moduleFederationOpt === 'function') {
        moduleFederationOpt = await moduleFederationOpt(store.config)
      }
      if (moduleFederationOpt.name) {
        moduleFederationOpt.filename = moduleFederationOpt.filename || 'emp.js'
        // emp esm module
        if (!moduleFederationOpt.library && store.isESM) {
          //TODO: 实验 MF 的 ESM 模式是否正常运行
          // moduleFederationOpt.library = {type: 'module'}
          // moduleFederationOpt.library = {type: 'window', name: moduleFederationOpt.name}
        }
        this.moduleFederation = moduleFederationOpt
      }
    }
  }
}
export default EMPShare
