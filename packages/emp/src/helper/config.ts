import {BuildOptions, initBuild} from './build'
import {ServerOptions, initServer} from './server'
export type EMPConfig = {
  /**
   * 项目代码路径
   * @default 'src'
   */
  appSrc?: string
  /**
   * publicPath 根路径 可参考webpack
   * 库模式 默认为 / 避免加入 auto判断
   * 业务模式默认为 auto
   * @default '/'
   */
  base?: string
  /**
   * 静态文件路径
   * @default 'public'
   */
  publicDir?: string
  /**
   * 缓存目录
   * @default 'node_modules/.emp-cache'
   */
  cacheDir?: string
  /**
   * 命令行 --mode option.
   */
  mode?: string
  /**
   * 全局环境替换
   */
  define?: Record<string, any>
  plugins?: any[]
  server?: ServerOptions
  build?: BuildOptions
  /**
   * 日志级别
   * @default 'info'
   */
  logLevel?: string
}
export interface ConfigEnv {
  mode: string
  [key: string]: string
}
export type EMPConfigFn = (env?: ConfigEnv) => EMPConfig | Promise<EMPConfig>
export type EMPConfigExport = EMPConfig | Promise<EMPConfig> | EMPConfigFn
export function defineConfig(config: EMPConfigExport): EMPConfigExport {
  return config
}
export type ResovleConfig = Required<EMPConfig> & {
  build: Required<BuildOptions>
}
export const initConfig = (op: EMPConfig | any = {}): ResovleConfig => {
  //解决深度拷贝被替代问题
  const build = initBuild(op.build)
  delete op.build
  const server = initServer(op.server)
  delete op.server
  //
  return {
    ...{
      mode: 'dev',
      appSrc: 'src',
      base: '/',
      publicDir: 'public',
      cacheDir: 'node_modules/.emp-cache',
      build,
      define: [],
      plugins: [],
      server,
      logLevel: 'info',
    },
    ...op,
  }
}
