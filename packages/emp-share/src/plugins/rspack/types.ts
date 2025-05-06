import type {ModuleFederationPlugin} from 'src/helper/rspack'
export type ModuleFederationPluginOptions = ConstructorParameters<typeof ModuleFederationPlugin>[0]
export type EMPSHARERuntimeOptions = {
  /**
   * 兼容 emp2.0 shareLib 配置
   */
  shareLib?: {[key: string]: string | string[] | {entry: string; global: string; type: string}}
  /**
   * UI框架 全局命名
   */
  frameworkGlobal?: string
  /**
   * MFRuntime 远程地址
   */
  runtimeLib?: string | 'useFrameworkLib'
  runtime?: runtimeLibType
  /**
   * MFRuntime 全局命名
   */
  runtimeGlobal?: string
  setExternals?: (o: any, frameworkGlobal: string, runtimeGlobal?: string) => void
  injectGlobalValToHtml?: boolean
  /**
   * 快捷设置 external 默认为 react
   */
  framework?: 'react' | 'vue2' | 'vue' | frameworkOptions
  /**
   * UI框架 远程地址 统一规范 或者 dev prod 分离都支持
   */
  frameworkLib?: frameworLibType
}
export type runtimeLibType = {
  /**
   * MFRuntime 地址
   */
  lib: string
  /**
   * MFRuntime 全局命名
   */
  global?: string
}
export type frameworLibType =
  | string
  | {
      dev: string
      prod: string
    }
export type frameworkOptions = {
  /**
   * 框架名称
   */
  name?: 'react' | 'vue' | 'none'
  /**
   * 框架版本
   */
  version?: number
  /**
   * 框架入口 默认 runtime
   */
  entry?: string
  /**
   * umd lib name
   * 与 frameworkGlobal 相同 可以只设置一个
   */
  global: string
  /**
   * UI框架 远程地址 统一规范 或者 dev prod 分离都支持
   * 与 frameworkLib 相同 可以只设置一个
   */
  lib?: frameworLibType
  /**
   * UI框架 全量导入 支持多个js导入
   */
  libs?: string[]
}

export type EMPPluginShareType = ModuleFederationPluginOptions & {
  empRuntime?: EMPSHARERuntimeOptions
}

export type ExternalsItemType = {
  /**
   * 模块名
   * @example react-dom
   */
  module?: string
  /**
   * 全局变量
   * @example ReactDom
   */
  global?: string
  /**
   * 入口地址
   * 不填则可以通过 emp-config 里的 html.files.js[url] 传入合并后的请求
   * 如 http://...?react&react-dom&react-router&mobx
   * @example http://
   */
  entry?: string
  /**
   * 类型入口
   * @default js
   * @enum js | css
   * @example css
   */
  type?: string
}
