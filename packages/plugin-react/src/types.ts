export type PluginReactType = {
  /**
   * 是否启动 热更 默认为 true
   */
  hmr?: boolean
  /**
   * 是否启动 Svg React Component
   * @default ?react
   */
  svgrQuery?: string
  /**
   * React Runtime 手动切换jsx模式
   * 当 external react时需要设置
   * 本地安装时会自动判断 不需要设置
   * @default undefined
   */
  reactRuntime?: string
  splickChunks?: boolean
  /**
   * react version 适配cdn 加载环境
   * 不安装 react 必须手动输入版本号 以便适配配置
   * @default 18
   */
  version?: number
  import?: {
    src: string
    externals?: {
      [key: string]: string
    }
  }
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
}
