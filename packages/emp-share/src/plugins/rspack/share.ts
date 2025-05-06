import type {GlobalStore} from '@empjs/cli'
import {deepAssign} from 'src/helper'
import {shareGlobalName} from 'src/helper/config'
import {ModuleFederationPlugin} from 'src/helper/rspack'
import {EmpShareRemoteLibPlugin} from './plugin'
import type {
  EMPPluginShareType,
  ExternalsItemType,
  ModuleFederationPluginOptions,
  frameworkOptions,
  runtimeLibType,
} from './types'
import {getRuntimeLib} from './utils'
const exp = /^([0-9a-zA-Z_\s]+)@(.*)/
export class EmpShare {
  private op: EMPPluginShareType
  private store: GlobalStore
  /**
   * 注入资源
   */
  private injectHtml: any[] = []
  /**
   * 兼容 shareLib
   */
  private externalsLib: ExternalsItemType[] = []
  constructor(op: EMPPluginShareType, store: GlobalStore) {
    this.op = op || {}
    this.store = store
  }
  setup() {
    this.resetRuntime()
    this.resetFramework()
    this.setMfName() //设置 mfName 默认为 uniqueName
    this.setMF() // 设置 MF 配置
    this.injectGlobalVal() // 插入全局变量 方便emp外的项目调用
    this.injectFramework() // 插入ui框架库
    this.setShareLib() //兼容 emp Sharelib的共享模型设置
    this.setRuntimeLib() // 设置 MF SDK
    this.injectToHtml() //触发插入动作
    this.setExternal() // 设置 external 降低包体
  }
  private injectToHtml() {
    const {store, injectHtml} = this
    if (injectHtml.length > 0) {
      store.injectTags(injectHtml, 'EMPShare')
    }
  }
  private injectFramework() {
    if (this.fk.libs.length > 0) {
      return this.injectFkLibs(this.fk.libs)
    }
    if (!this.op.empRuntime || !this.fk.lib) return
    const {store, injectHtml} = this
    if (this.fk.lib) {
      const url = getRuntimeLib(this.fk.lib, store.mode, this.fk.entry)
      injectHtml.push({
        attributes: {
          src: url,
        },
        tagName: 'script',
      })
    }
  }
  private injectFkLibs(libs: string[]) {
    libs.map(url => {
      if (url.endsWith('.css')) {
        return this.injectHtml.push({
          attributes: {
            href: url,
            rel: 'stylesheet',
          },
          tagName: 'link',
        })
      }
      this.injectHtml.push({
        attributes: {
          src: url,
        },
        tagName: 'script',
      })
    })
  }
  private injectGlobalVal() {
    if (!this.op.empRuntime) return
    const {empRuntime} = this.op
    const {injectHtml} = this
    const frameworkGlobal = this.fk.global || (empRuntime.shareLib ? 'window' : '')
    const injectGlobalValToHtml = empRuntime.injectGlobalValToHtml === false || !this.rt.lib ? false : true
    // 插入全局引用变量 让 empRuntime 可以提前实例化 不需要在页面重复实例化
    if (injectGlobalValToHtml) {
      const injectData: any = {frameworkLib: frameworkGlobal, runtimeLib: this.rt.global}
      if (this.fk.name && this.fk.name !== 'none') injectData.framework = this.fk.name
      injectHtml.push({
        // type: 'js',
        tagName: 'script',
        innerHTML: `EMPShareGlobalVal=${JSON.stringify(injectData)}`,
      })
    }
  }
  public fk!: Required<frameworkOptions>
  private resetFramework() {
    if (!this.op.empRuntime) return
    const {framework, frameworkGlobal, frameworkLib} = this.op.empRuntime
    //
    this.fk = {
      name: 'none',
      version: 0,
      entry: '',
      global: frameworkGlobal || '',
      lib: frameworkLib || '',
      libs: [],
    }
    //
    if (typeof framework === 'string') {
      this.fk.name = framework as any
    }
    // TODO 通用 CDN 的适配方案
    else if (typeof framework === 'object' && Object.keys(framework).length > 0) {
      // 默认 框架名 为入口
      framework.entry = framework.entry ? framework.entry : framework.name
      this.fk = deepAssign(this.fk, framework)
    }
  }
  public rt!: Required<runtimeLibType>
  private resetRuntime() {
    const {empRuntime} = this.op
    if (!empRuntime) return
    const global = empRuntime.runtimeGlobal || shareGlobalName
    const lib = empRuntime.runtimeLib ? empRuntime.runtimeLib : empRuntime.runtime?.lib ? empRuntime.runtime.lib : ''
    this.rt = {
      lib,
      global,
    }
  }
  private setExternal() {
    if (!this.op.empRuntime) return
    const {store, externalsLib} = this
    const {empRuntime} = this.op
    const {shareLib} = empRuntime
    //
    const externalRuntime = this.rt.lib
      ? {
          '@module-federation/runtime': `MFRuntime`,
          '@module-federation/sdk': `MFSDK`,
        }
      : {}
    const externals = {}
    for (const [key, value] of Object.entries(externalRuntime)) {
      externals[key] = `${this.rt.global}.${value}`
    }
    /**
     * TODO
     * 框架相关内容需要移除 share 由外部简化配置实现
     */
    if (this.fk.name === 'react' && !shareLib && this.fk.global) {
      const version = this.fk.version
      const externalReact = {
        react: `React`,
        'react-dom': `ReactDOM`,
      }
      if (this.fk.entry === 'reactRouter') {
        externalReact['react-router-dom'] = 'ReactRouterDOM'
      }
      for (const [key, value] of Object.entries(externalReact)) {
        externals[key] = `${this.fk.global}.${value}`
      }
      if ([17, 18, 19].includes(version)) {
        externals['react-dom/client'] = this.fk.global
        externals['react/jsx-runtime'] = this.fk.global
        externals['react/jsx-dev-runtime'] = this.fk.global
      }
    }
    if (shareLib) {
      externalsLib.map(v => {
        if (v.type === 'js' && v.module && v.global) {
          externals[v.module] = `${this.fk.global}.${v.global}`
        }
      })
    }
    if (empRuntime.setExternals) empRuntime.setExternals(externals, this.fk.global, this.rt.global)
    //
    // console.log('externals in plugin', externals)
    store.chain.merge({externals})
  }
  private setRuntimeLib() {
    if (!this.op.empRuntime) return

    const {shareLib} = this.op.empRuntime
    const {store, injectHtml} = this
    const {empRuntime} = this.op
    if (!this.rt.lib) {
      // 内置 this.rt.lib
      store.chain.plugin('plugin-emp-share-framework').use(EmpShareRemoteLibPlugin, [empRuntime])
    }
    // 统一封装到 frameworkLib
    else if (this.rt.lib === 'useFrameworkLib' && !shareLib) {
    } else {
      // 插入 runtime
      injectHtml.push({tagName: 'script', pos: 'head', attributes: {src: this.rt.lib}})
    }
  }
  private setMfName() {
    if (this.op.name) {
      this.op.name = this.store.encodeVarName(this.op.name)
      if (this.op.name !== this.store.empConfig.output.uniqueName) {
        this.store.chain.output.set('uniqueName', this.op.name)
      }
    } else {
      this.op.name = this.store.empConfig.output.uniqueName
    }
  }
  private setMF() {
    const o = this.op
    const {store} = this
    if (o.name) {
      const op = store.deepAssign<ModuleFederationPluginOptions & {empRuntime: any}>(
        {
          filename: 'emp.js',
          manifest: false,
          dts: false,
          dev: {
            disableDynamicRemoteTypeHints: true,
          },
        },
        o,
      )
      //
      if (o.dev === false) op.dev = false
      //
      if (op.empRuntime) {
        delete op.empRuntime
      }
      store.chain.plugin('plugin-emp-share').use(ModuleFederationPlugin, [op])
    }
  }
  private setShareLib() {
    if (!this.op.empRuntime) return
    const {shareLib} = this.op.empRuntime
    const {externalsLib, injectHtml} = this
    if (shareLib && typeof shareLib === 'object') {
      for (const [k, v] of Object.entries(shareLib)) {
        let externalsItem: ExternalsItemType = {}
        externalsItem.module = k
        //增加下划线 支持lodash 等特殊符号的问题 如 _@http

        if (typeof v === 'string') {
          const cb: any = v.match(exp) || []
          if (cb.length > 0) {
            externalsItem.global = cb[1]
            externalsItem.entry = cb[2]
            externalsItem.type = 'js'
            externalsLib.push(externalsItem)
            externalsItem = {}
          } else {
            externalsItem.global = ''
            externalsItem.entry = v
            externalsItem.type = 'js'
            externalsLib.push(externalsItem)
            externalsItem = {}
          }
        } else if (Array.isArray(v)) {
          v.map(vo => {
            if (!vo) return
            const isCSS = vo.split('?')[0].endsWith('.css')
            if (isCSS) {
              externalsItem.entry = vo
              externalsItem.type = 'css'
            } else {
              const cb: any = vo.match(exp) || []
              if (cb.length > 0) {
                externalsItem.global = cb[1]
                externalsItem.entry = cb[2]
                externalsItem.type = 'js'
              } else {
                externalsItem.global = ''
                externalsItem.entry = vo
                externalsItem.type = 'js'
              }
            }
            externalsLib.push(externalsItem)
            externalsItem = {}
          })
        } else if (typeof v === 'object' && v.entry) {
          externalsItem.entry = v.entry
          externalsItem.global = v.global
          externalsItem.type = v.type
          externalsLib.push(externalsItem)
          externalsItem = {}
        }
      }
      // console.log(externalsLib)
      externalsLib.map(v => {
        if (v.type === 'js') {
          injectHtml.push({
            attributes: {
              src: v.entry,
            },
            tagName: 'script',
          })
        } else if (v.type === 'css') {
          injectHtml.push({
            attributes: {
              href: v.entry,
              rel: 'stylesheet',
            },
            tagName: 'link',
          })
        }
      })
    }
  }
}
