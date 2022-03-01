export * from './empShare'
export * from './externals'
export * from './modulefederation'
export * from './libMode'
import {HtmlOptions} from 'src/config/html'
import {LoggerType} from 'src/helper/logger'
//
import {Configuration, ResolveOptions} from 'webpack'
export type modeType = 'development' | 'production' | 'none' | undefined
export type cliOptionsType = {[key: string]: string | number | boolean} & {
  /**
   * 全局环境变量
   * dotenv 先根据env做判断、否则再按照 webpack mode 做判断
   */
  env?: string
  analyze?: boolean
  typingsPath?: string
}
export type wpPathsType = {
  output: Configuration['output']
}
export type ConfigResolveAliasType = {[index: string]: string}
export type ConfigResolveType = {
  modules: ResolveOptions['modules']
  alias: ConfigResolveAliasType
  extensions: ResolveOptions['extensions']
  extends: boolean
}
export type externalAssetsType = {
  js: string[]
  css: string[]
}
export type pkgType = {
  dependencies: any
  devDependencies: any
  version: string
  name: string
  [key: string]: any
}
export type EntriesType = {[entryFilename: string]: HtmlOptions}
export type Override<What, With> = Omit<What, keyof With> & With

export type ConfigDebugType = {
  clearLog: boolean
  progress: boolean
  profile: boolean
  wplogger: boolean
  /**
   * 日志级别
   */
  level: LoggerType
}
