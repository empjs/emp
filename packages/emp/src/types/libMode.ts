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

export type LibModeType = {
  /**
   * 入口文件
   */
  entry: string | string[]
  /**
   * amd umd window var ... 需要导出的名称
   */
  name: string
  /**
   * 输出格式
   */
  formats: buildLibType[]
}
