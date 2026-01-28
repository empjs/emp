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

/**
 * runtime beforeRegisterRemote 收到的 remote 对象结构（与 @module-federation/runtime Remote 兼容）
 */
export type RemoteInfoForForce = {
  /** 唯一标识，如 @nova/bigolive-common，用于匹配 forceRemotes key（优先于 name） */
  alias?: string
  /** 占位名，如 $1，可能重名；插件会为占位名生成唯一 name */
  name?: string
  /** 入口地址（与 url、manifest 三选一） */
  entry?: string
  url?: string
  manifest?: string
  /** 版本（可选）；若缺失则从 entry/url/manifest 中解析 */
  version?: string
  externalType?: string
  shareScope?: string
  type?: string
}

/**
 * 单项配置：仅替换 URL 中 `key@oldVer` 的版本部分
 * @example "17.0.0"
 */
export type ForceRemoteVersion = string

/**
 * 单项配置：显式指定仅替换版本（与 string 等价，便于扩展）
 * @example { version: "17.0.0" }
 */
export type ForceRemoteVersionOption = { version: string }

/**
 * 单项配置：整入口替换（key 匹配 remote 的 alias 或 name 时生效，直接替换该 remote 的 entry/url/manifest）
 * 匹配时优先用 alias（唯一标识，如 @nova/bigolive-common），避免 name 为 $1 等占位符导致重名
 * @example { entry: "https://cdn.example.com/app1.js" }
 */
export type ForceRemoteEntryOption = { entry: string }

/**
 * forceRemotes 每项：版本替换 或 整入口替换
 * - string / { version }：对所有 remote 的 entry/url/manifest 中 `key@xxx` 做版本替换
 * - { entry }：key 为 remote 的 alias（优先）或 name 时，对该 remote 做整入口替换
 */
export type ForceRemoteItem = ForceRemoteVersion | ForceRemoteVersionOption | ForceRemoteEntryOption

export type ForceRemoteOptions = Record<string, ForceRemoteItem>

export type EMPPluginShareType = ModuleFederationPluginOptions & {
  empRuntime?: EMPSHARERuntimeOptions
  forceRemotes?: ForceRemoteOptions
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
