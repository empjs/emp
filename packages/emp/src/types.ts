import {Configuration} from 'webpack'
export type modeType = 'development' | 'production' | 'none' | undefined
export type cliOptionsType = {[key: string]: string | number | boolean}
export type wpPathsType = {
  output: Configuration['output']
}
export type externalAssetsType = {
  js: string[]
  css: string[]
}
