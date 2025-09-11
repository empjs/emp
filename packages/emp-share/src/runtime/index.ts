import type {ModuleFederation} from '@module-federation/runtime'
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
  constructor(op?: EMPShareRuntimeType) {
    if (op) this.setup(op)
  }
  public mfInstance?: ModuleFederation
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
    if (this.mfInstance) return this.mfInstance
    let op: InitOptionsType = {
      name: 'empRuntimeProject',
      remotes: [],
      // plugins: [catchErrorNextPlugin(this.options.showLog)],
    }
    op = deepAssign<InitOptionsType>(op, options)
    this.mfInstance = this.libs.MFRuntime.createInstance(op)
  }
  public load<T = any>(...args: LoadRemoteType) {
    return this.mfInstance?.loadRemote<T>(...args) as Promise<T>
  }
  public register(...args: Parameters<NonNullable<typeof this.mfInstance>['registerRemotes']>) {
    return this.mfInstance?.registerRemotes(...args)
  }
  public preload(...args: Parameters<NonNullable<typeof this.mfInstance>['preloadRemote']>) {
    return this.mfInstance?.preloadRemote(...args)
  }
  public loadShare(...args: Parameters<NonNullable<typeof this.mfInstance>['loadShare']>) {
    return this.mfInstance?.loadShare(...args)
  }
  public preloadRemote(...args: Parameters<NonNullable<typeof this.mfInstance>['preloadRemote']>) {
    return this.mfInstance?.preloadRemote(...args)
  }
}
//
export default new EMPRuntime()
