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
  wplogger: boolean | string // --wplogger [filename] 可以为 string
  /**
   * 日志级别
   */
  level: LoggerType
}
/**
 * compile 构建相关
 * @param loader loader方法
 * @param minify 是否 使用进行 js压缩
 * @default false
 * @param cssminify 是否使用进行 css压缩
 * @default false
 */
export type CompileLoaderCallBackType = {
  loader: any
  options: any
}
export type CompileLoaderType = (...args: any[]) => CompileLoaderCallBackType
export type CompileLoaderNameType = 'babel' | 'swc' | 'esbuild'
export type CompileType = {
  loader: CompileLoaderType
  compileType: CompileLoaderNameType
  minify?: boolean
  cssminify?: boolean
}
//
export type JscTarget =
  | 'es3'
  | 'es5'
  | 'es2015'
  | 'es2016'
  | 'es2017'
  | 'es2018'
  | 'es2019'
  | 'es2020'
  | 'es2021'
  | 'es2022'
