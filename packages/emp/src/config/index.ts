// import store from 'src/helper/store'
import {BuildOptions, initBuild} from 'src/config/build'
import {ServerOptions, initServer} from 'src/config/server'
import {cliOptionsType, modeType, Override, EntriesType, ConfigResolveType, ConfigDebugType} from 'src/types'
import {ExternalsType} from 'src/types/externals'
import {ConfigPluginType} from 'src/config/plugins'
import {WebpackChainType} from './chain'
import {HtmlOptions, initHtml, InitHtmlType} from 'src/config/html'
import {MFExport} from 'src/types/moduleFederation'
import {EMPShareExport} from 'src/types/empShare'
// import {LoggerType} from 'src/helper/logger'
import path from 'path'
import {RuleSetRule} from 'webpack'
import templates from './templates'
//
export type EMPConfig = {
  /**
   * 项目根目录绝对路径 提供给 plugin 使用 一般不需要设置
   * @default process.cwd()
   */
  root?: string
  /**
   * 项目代码路径
   * @default 'src'
   */
  appSrc?: string
  /**
   * 项目代码入口文件 如 `src/index.js`
   * (*)entries 设置后 该选项失效
   * @default 'index.js'
   */
  appEntry?: string
  /**
   * publicPath 根路径 可参考webpack,库模式 默认为 '' 避免加入 auto判断,业务模式默认为 auto
   * html 部分 publicPath 默认为 undefined,可设置全量域名或子目录适配，也可以单独在html设置 Public
   *
   * @default undefined
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
   * 调试模式为 development
   * 构建模式为 production
   * 正式环境为 none
   */
  mode?: modeType
  /**
   * 通过命令行指令 `--env` 赋值
   */
  env?: ConfigEnv['env']
  /**
   * 全局环境替换
   */
  define?: Record<string, any>
  /**
   * resolve
   */
  resolve?: ConfigResolveType
  /**
   * emp plugins
   */
  plugins?: ConfigPluginType[]
  /**
   * dev server
   */
  server?: ServerOptions
  /**
   * build options
   */
  build?: BuildOptions
  /**
   * library externals
   */
  externals?: ExternalsType
  /**
   * TODO 还不支持 mf,esm下不起作用
   * 利用 externalsType=script 替代 script src 可以减少对 head 插入 script操作
   * @default false
   */
  useExternalsReplaceScript?: boolean
  /**
   * debug 选项
   */
  debug?: ConfigDebugType
  /**
   * webpackChain 暴露到 emp-config
   */
  webpackChain?: WebpackChainType

  /**
   * module federation 配置
   */
  moduleFederation?: MFExport
  /**
   * emp share 配置
   * 实现3重共享模型
   * empshare 与 module federation 只能选择一个配置
   */
  empShare?: EMPShareExport
  /**
   * 启用 import.meta
   * 需要在 script type=module 才可以执行
   * @default false
   */
  useImportMeta?: boolean
  /**
   * 启用 ForkTsChecker or Eslint
   * @default false
   */
  jsCheck?: boolean
  /**
   * 启动 mini-css-extract-plugin
   * 分离 js里的css
   * @default true
   */
  splitCss?: boolean
  /**
   * html-webpack-plugin 相关操作
   * (*)entries 设置后 会继承这里的操作
   */
  html?: HtmlOptions
  /**
   * 多页面模式
   * entryFilename 为基于 src目录如 `info/index`
   */
  entries?: EntriesType
  /**
   * React Runtime 手动切换jsx模式
   * 当 external react时需要设置
   * 本地安装时会自动判断 不需要设置
   * @default undefined
   */
  reactRuntime?: 'automatic' | 'classic'
  /**
   * typingsPath
   * @default ./src/empShareType
   * emp dts 类型同步
   */
  typingsPath?: string
  /**
   * 模块编译
   * 如 node_modules 模块 是否加入编译
   */
  moduleTransform?: ModuleTransform
  /**
   * initTemplates
   * 暂无场景 弃置
   */
  // initTemplates?: {[key: string]: string | boolean}
}
export interface ConfigEnv {
  mode: modeType
  env?: string
  [key: string]: any
}
export interface ModuleTransform {
  exclude?: RuleSetRule['exclude'][]
  include?: RuleSetRule['include'][]
  /**
   * 构建方式 esbuild 还没解决
   * @default babel
   */
  parser?: 'babel' | 'swc'
}
export type EMPConfigFn = (configEnv: ConfigEnv) => EMPConfig | Promise<EMPConfig>
export type EMPConfigExport = EMPConfig | EMPConfigFn
export function defineConfig(config: EMPConfigExport): EMPConfigExport {
  return config
}
//

export type ResovleConfig = Override<
  Required<EMPConfig>,
  {
    build: Required<BuildOptions>
    server: Required<ServerOptions>
    moduleFederation?: MFExport
    externals?: ExternalsType
    useExternalsReplaceScript: boolean
    empShare?: EMPShareExport
    webpackChain?: WebpackChainType
    reactRuntime?: 'automatic' | 'classic'
    base?: string
    html: InitHtmlType
    entries?: EntriesType
    debug: ConfigDebugType
    env?: ConfigEnv['env']
    mode: modeType
    dtsPath: {[key: string]: string}
    moduleTransform: ModuleTransform
    moduleTransformExclude: RuleSetRule['exclude']
    // initTemplates: {[key: string]: string | boolean}
  }
>
export const initConfig = (op: any = {}): ResovleConfig => {
  //解决深度拷贝被替代问题
  const build = initBuild(op.build)
  delete op.build
  //
  const server = initServer(op.server)
  delete op.server
  //
  const html = initHtml(op.html)
  delete op.html
  //
  const dtsPath = op.dtsPath ?? []
  delete op.dtsPath
  //
  const debug: ConfigDebugType = {
    clearLog: true,
    profile: false,
    wplogger: false,
    progress: true,
    level: 'info',
    ...(op.debug || {}),
  }
  delete op.debug
  //
  // const initTemplates = op.initTemplates ? op.initTemplates : templates
  // if (op.initTemplates) delete op.initTemplates
  //
  const moduleTransformExclude: RuleSetRule['exclude'] = {and: [/(node_modules|bower_components)/]}
  op.moduleTransform = op.moduleTransform || {}
  op.moduleTransform.parser = op.moduleTransform.parser || 'babel'
  if (op.moduleTransform.exclude) {
    moduleTransformExclude.and = op.moduleTransform.exclude
  }
  if (op.moduleTransform.include) {
    moduleTransformExclude.not = op.moduleTransform.include
  }
  // delete op.moduleTransform
  //
  return {
    ...{
      root: process.cwd(),
      env: undefined,
      appSrc: 'src',
      publicDir: 'public',
      cacheDir: 'node_modules/.emp-cache',
      build,
      define: [],
      plugins: [],
      server,
      html,
      debug,
      useImportMeta: false,
      splitCss: true,
      appEntry: '',
      jsCheck: false,
      typingsPath: path.resolve('src', 'empShareTypes'),
      dtsPath,
      moduleTransformExclude,
      // initTemplates,
      useExternalsReplaceScript: false,
    },
    ...op,
  }
}
