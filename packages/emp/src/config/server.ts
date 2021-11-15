import {Configuration} from 'webpack-dev-server'
export type ServerConfig = {
  /**
   * 访问 host
   * @default '0.0.0.0'
   */
  host?: string
  /**
   * 访问 端口
   * @default 8000
   */
  port?: number
  /**
   * 自动切换端口
   * @default false
   */
  // strictPort?: boolean
  // https?: Configuration['https']
  // proxy?: Configuration['proxy'] | boolean
  /**
   * 自动打开
   * @default false
   */
  open?: Configuration['open']
  /**
   * 热重载
   * @default true
   */
  hot?: Configuration['hot']
}
export type ServerOptions = Configuration & ServerConfig
export type ResolveServerConfig = Configuration & Required<ServerConfig>
export const initServer = (op?: ServerOptions): ResolveServerConfig => ({
  ...{
    host: '0.0.0.0',
    port: 8000,
    // strictPort: false,
    // https: false,
    open: false,
    // proxy: false,
    hot: true,
    ...op,
  },
})
