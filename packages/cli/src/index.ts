export type {EmpOptions} from 'src/types/config'

import type {GlobalStore} from 'src/store'
import type {EmpOptions} from 'src/types/config'

export type {EMP3PluginFnType, EMP3PluginType} from 'src/types/plugin'

import {type RspackOptions, rspack} from '@rspack/core'
import {program} from 'commander'
import runScript from 'src/script'
import store from 'src/store'
export type EMPConfigFn = (store: GlobalStore) => EmpOptions | Promise<EmpOptions>
export type EMPConfigExport = EmpOptions | EMPConfigFn
export function defineConfig(config: EMPConfigExport): EMPConfigExport {
  return config
}

import {color, Logger} from 'src/helper/logger'
export {store, runScript, rspack, program, color, Logger}
export type {GlobalStore, RspackOptions}
export type {Compilation, Compiler, LoaderContext} from '@rspack/core'
export * as empHelper from 'src/helper'
