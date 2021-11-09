import {container} from 'webpack'
import {BuildOptions, initBuild} from 'src/config/build'
import {ServerOptions, initServer} from 'src/config/server'
import {modeType} from 'src/types'
import {ExternalsType} from 'src/webpack/options/externals'
import {ConfigPluginType} from 'src/config/plugins'
//
type MFOptions = ConstructorParameters<typeof container.ModuleFederationPlugin>[0]
//
export type EMPConfig = {
  /**
   * 项目代码路径
   * @default 'src'
   */
  appSrc?: string
  /**
   * 项目代码入口文件 如 `src/index.js`
   * @default 'index.js'
   */
  appEntry?: string
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
  plugins?: ConfigPluginType[]
  server?: ServerOptions
  build?: BuildOptions
  externals?: ExternalsType
  /**
   * 日志级别
   * @default 'info'
   */
  logLevel?: string
  moduleFederation?: MFOptions
}
export interface ConfigEnv {
  mode: modeType
  [key: string]: any
}
export type EMPConfigFn = (env?: ConfigEnv) => EMPConfig | Promise<EMPConfig>
export type EMPConfigExport = EMPConfig | Promise<EMPConfig> | EMPConfigFn
export function defineConfig(config: EMPConfigExport): EMPConfigExport {
  return config
}
export type ResovleConfig = Required<EMPConfig> & {
  build: Required<BuildOptions>
  server: Required<ServerOptions>
  moduleFederation?: MFOptions
}
export const initConfig = (op: EMPConfig = {}, mode = 'development'): any => {
  //解决深度拷贝被替代问题
  const build = initBuild(op.build)
  delete op.build
  const server = initServer(op.server)
  delete op.server
  /* if (op.moduleFederation) {
    op.moduleFederation.filename = op.moduleFederation.filename || 'emp.js'
    // emp esm module
    if (!op.moduleFederation.library && ['es3', 'es5'].indexOf(build.target) === -1) {
      op.moduleFederation.library = {type: 'module'}
    }
  } */
  //
  return {
    ...{
      mode,
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
