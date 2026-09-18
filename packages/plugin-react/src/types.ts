export type PluginReactType = {
  /**
   * 是否启动 热更 默认为 true
   */
  hmr?: boolean
  /**
   * 是否启动 Svg React Component。
   * 该值作为正则源码匹配 svg 请求的 `resourceQuery`：默认 'react' 命中 `?react`。
   * @default 'react'
   */
  svgrQuery?: string
  /**
   * React Runtime 手动切换 jsx 模式。
   * 本地安装 React 时会按依赖版本自动判定（>=17 为 automatic），一般不需要设置。
   * @deprecated EMP v4 面向 React >= 17，自动判定恒为 `automatic`；本字段只在需要
   * `classic` 的 React <= 16 场景下有意义，而该组合不在 v4 支持范围内。后续主版本将移除。
   */
  reactRuntime?: string
  /**
   * 是否为 React 与 React Router 依赖创建独立 splitChunks cache group。
   * @default false
   */
  splitChunks?: boolean
  /**
   * @deprecated 拼写错误，请使用 splitChunks，后续主版本将移除此字段。
   */
  splickChunks?: boolean
  /**
   * react version 适配cdn 加载环境
   * 不安装 react 必须手动输入版本号 以便适配配置
   * @default 18
   */
  version?: number
  /**
   * @deprecated 请改用 `html.tags` 注入脚本，`import.externals` 改用顶层 `externals`。
   * 本字段注入的 script 没有指定 `pos`，会落到 body；而 externals 对应的 CDN 脚本
   * 必须早于业务代码加载。外置 React 场景推荐 `pluginRspackEmpShare({empRuntime})`。
   */
  import?: {
    src: string
    /** @deprecated 与顶层 `externals` 重复，请使用 `externals`。 */
    externals?: {
      [key: string]: string
    }
  }
  reactCompiler?: boolean | ReactCompilerOptions
}
export type ReactCompilerOptions = {
  target?: '17' | '18' | '19'
  runtimeModule?: string
  compilationMode?: 'annotation' | 'infer' | 'all'
  [key: string]: unknown
}
/**
 * React Refresh 插件配置选项
 * 参考: https://github.com/rspack-contrib/rspack-plugin-react-refresh
 */
export type PluginReactConfigType = {
  include?: RegExp | RegExp[] // 包含的文件匹配规则
  exclude?: RegExp | RegExp[] // 排除的文件匹配规则
  library?: string // 模块联邦共享库名称
  overlay?:
    | boolean
    | {
        // 错误覆盖层配置
        entry?: string | string[]
        module?: string | string[]
        sockIntegration?: 'wds' | 'whm'
        sockHost?: string
        sockPort?: number
        sockPath?: string
        sockProtocol?: 'http' | 'https'
      }
  useLegacyWDSSockets?: boolean // 是否使用旧版WDS socket
  forceEnable?: boolean // 是否强制启用
  /**
   * Whether to inject the builtin:react-refresh-loader
   * @default true
   */
  injectLoader?: boolean

  /**
   * Whether to inject the client/reactRefreshEntry.js
   * @default true
   */
  injectEntry?: boolean
  reloadOnRuntimeErrors?: boolean
}
