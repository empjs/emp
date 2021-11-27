export * from './empShare'
export * from './externals'
export * from './modulefederation'
import {HtmlOptions} from 'src/config/html'
//
import {Configuration} from 'webpack'
export type modeType = 'development' | 'production' | 'none' | undefined
export type cliOptionsType = {[key: string]: string | number | boolean} & {
  /**
   * 全局环境变量
   * dotenv 先根据env做判断、否则再按照 webpack mode 做判断
   */
  env?: string
  clearLog?: boolean
}
export type wpPathsType = {
  output: Configuration['output']
}
export type externalAssetsType = {
  js: string[]
  css: string[]
}
export type pkgType = {
  dependencies: any
  devDependencies: any
  version: string
  [key: string]: any
}
export type EntriesType = {[entryFilename: string]: HtmlOptions}
export type Override<What, With> = Omit<What, keyof With> & With
