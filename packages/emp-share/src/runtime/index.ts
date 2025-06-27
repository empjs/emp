import {deepAssign} from 'src/helper'
import {shareGlobalName} from 'src/helper/config'
import type {EMPShareRuntimeType, EmpRuntimeOptions, InitOptionsType, LoadRemoteType} from 'src/types'

type EmpInitOptionsType = Partial<InitOptionsType>
let globalLib = window[shareGlobalName] || {}
// 根据 injectGlobalValToHtml 提前把库赋值到 EMPRuntime
const win: any = window
const {EMPShareGlobalVal} = win || {}
if (EMPShareGlobalVal && EMPShareGlobalVal.runtimeLib) {
  globalLib = win[EMPShareGlobalVal.runtimeLib]
}

export class EMPRuntime {
  public libs: EMPShareRuntimeType = globalLib
  public initOptions!: InitOptionsType
  public options: EmpRuntimeOptions = {
    showLog: false,
  }
  public shareGlobalName = shareGlobalName
  private isInit = false
  constructor(op?: EMPShareRuntimeType) {
    if (op) this.setup(op)
  }
  /**
   * 实例化 adapter libs
   */
  public setup(o?: EMPShareRuntimeType | string) {
    if (o) {
      if (typeof o === 'string') o = window[o]
      this.libs = o as any
    }
    if (!this.libs.MFRuntime || !this.libs.MFSDK) {
      throw new Error('MFRuntime and MFSDK Required!')
    }
  }
  public init(options: EmpInitOptionsType = {}) {
    if (this.isInit) return
    let op: InitOptionsType = {
      name: 'empRuntimeProject',
      remotes: [],
      // plugins: [catchErrorNextPlugin(this.options.showLog)],
    }
    op = deepAssign<InitOptionsType>(op, options)
    this.libs.MFRuntime.init(op)
    this.isInit = true
  }
  public load<T = any>(...args: LoadRemoteType) {
    return this.libs.MFRuntime.loadRemote<T>(...args) as Promise<T>
  }
  public register = this.libs?.MFRuntime.registerRemotes
  public preload = this.libs?.MFRuntime.preloadRemote
  public loadShare = this.libs?.MFRuntime.loadShare
  public preloadRemote = this.libs?.MFRuntime.preloadRemote
}
//
export default new EMPRuntime()
