import {Configuration} from 'webpack'

export type buildLibType =
  | 'var'
  | 'module'
  | 'assign'
  | 'assign-properties'
  | 'this'
  | 'window'
  | 'self'
  | 'global'
  | 'commonjs'
  | 'commonjs2'
  | 'commonjs-module'
  | 'amd'
  | 'amd-require'
  | 'umd'
  | 'umd2'
  | 'jsonp'
  | 'system'
  | 'esm'

type FileNameType = (format: string) => string
export type LibModeType = {
  /**
   * 全局变量 用作 amd umd var window 等共享
   */
  name?: string
  /**
   *  入口文件 可以只设置 entry.name 代替 name，但要遵循 js 变量的命名规则
   */
  entry: string | string[]
  /**
   * fileName
   * @default [format]/[name].js 建议 format 为目录 避免不同格式代码混淆
   */
  fileName?: FileNameType | string
  /**
   * 输出格式
   */
  formats: buildLibType[]
  external?: Configuration['externals']
}
