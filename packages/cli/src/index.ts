export type {EmpOptions} from 'src/types/config'
import type {GlobalStore} from 'src/store'
import type {EmpOptions} from 'src/types/config'
export type {EMP3PluginType, EMP3PluginFnType} from 'src/types/plugin'
import {type Compiler, type RspackOptions, rspack} from '@rspack/core'
import runScript from 'src/script'
import store from 'src/store'
export type EMPConfigFn = (store: GlobalStore) => EmpOptions | Promise<EmpOptions>
export type EMPConfigExport = EmpOptions | EMPConfigFn
export function defineConfig(config: EMPConfigExport): EMPConfigExport {
  return config
}
export {store, runScript, rspack}
export type {GlobalStore, RspackOptions, Compiler}
export * as empHelper from 'src/helper'
