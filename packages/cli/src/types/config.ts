import type {InspectOptions} from 'node:util'
import type {RsdoctorRspackPlugin} from '@rsdoctor/rspack-plugin'
import type {Configuration as RsConfig} from '@rspack/core'
import type {
  Externals,
  HtmlRspackPluginOptions,
  // LightningCssMinimizerRspackPluginOptions,
  Output,
  Resolve,
  RuleSetRule,
  SourceMapDevToolPluginOptions,
  // SwcCssMinimizerRspackPlugin,
  SwcJsMinimizerRspackPluginOptions,
} from '@rspack/core'
import type {DevServer as devServerConfig} from '@rspack/core'
import type {HtmlTagObject} from 'html-webpack-plugin'
import type {Options as SassOptions} from 'sass-embedded'
import type {LifeCycleOptions} from 'src/store/lifeCycle'
import type {TsCheckerRspackPluginOptions} from 'ts-checker-rspack-plugin/lib/plugin-options'
import type Chain from 'webpack-chain'
import type {EMP3PluginType} from './plugin'

export type LoggerType = 'debug' | 'info' | 'warn' | 'error'
export type RsdoctorRspackPluginOptions = ConstructorParameters<typeof RsdoctorRspackPlugin>[0]
// export type CssminOptionsType = ConstructorParameters<typeof SwcCssMinimizerRspackPlugin>[0]
// export type CssminOptionsType = LightningCssMinimizerRspackPluginOptions
export type CssminOptionsType = any
// DebugType
export type DebugType = {
  loggerLevel?: LoggerType
  clearLog?: boolean
  progress?: boolean
  showRsconfig?: boolean | string | InspectOptions
  showPerformance?: boolean
  showScriptDebug?: boolean
  //rspackCache 已弃用
  // rspackCache?: boolean
  rsdoctor?: boolean | RsdoctorRspackPluginOptions
  newTreeshaking?: boolean
  devShowAllLog?: boolean //显示所有错误 默认关闭
  /**
   * 是否显示执行日志
   * @default false
   */
  infrastructureLogging?: RsConfig['infrastructureLogging']
  /**
   * 开启并行 code spitting
   * @default true
   */
  parallelCodeSplitting?: boolean
}
// devServer Type
export type ServerType = devServerConfig & {
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
   * 自动打开
   * @default false
   */
  open?: devServerConfig['open']
  /**
   * 热重载
   * @default true
   */
  hot?: devServerConfig['hot']
  http2?: boolean
  https?: boolean
}
export type PolyfillType = {
  /**
   * 注入兼容代码
   * module federation 入口 建议使用  entry
   * @default false
   */
  mode?: 'entry' | 'usage'
  /**
   * 当 mode=entry时，注入cdn替代 entry chunk
   */
  entryCdn?: string
  splitChunks?: boolean
  /**
   * 手动注入兼容代码,避免usage出现分析纰漏问题
   * @default ['es.object.values', 'es.object.entries', 'es.array.flat']
   */
  include?: string[]
  /**
   * 选择core-js的兼容版本有助于切换适当的代码体积
   * @default stable
   */
  coreJsFeatures?: 'full' | 'actual' | 'stable' | 'es'
  /**
   * @swc/helpers 外置
   * @default false
   */
  externalHelpers?: boolean
  /**
   * 浏览器 兼容版本
   */
  browserslist?: string[]
}
//
export type BuildType = {
  /**
   * 生成代码目录
   * @default 'dist'
   */
  outDir?: string
  /**
   * 生成静态目录
   * @default 'assets'
   */
  assetsDir?: string
  /**
   * 生成包含 js,css,asset 合集目录
   * @default ''
   */
  staticDir?: string
  /**
   * 静态文件路径
   * @default 'public'
   */
  publicDir?: string
  /**
   * named 使用有意义、方便调试的内容当作模块 id。此选项会在开发环境下默认开启。
   * deterministic 使用对模块标识符哈希后的数字当作模块 id，有益于长期缓存。此选项会在生产环境下默认开启。
   */
  moduleIds?: 'named' | 'deterministic'
  /**
   * chunkIds
   * @default named|deterministic
   */
  chunkIds?: false | 'natural' | 'named' | 'deterministic' | 'size' | 'total-size'
  /**
   * 是否生成 source map
   * @default true
   */
  sourcemap?: boolean | SourceMapDevToolPluginOptions
  /**
   * sourcemap 类型
   * 默认 source-map
   */
  devtool?: RsConfig['devtool']
  /**
   * 是否压缩
   * @default true
   */
  minify?: boolean
  /**
   * 设置内置压缩器配置
   * @default {}
   */
  minOptions?: SwcJsMinimizerRspackPluginOptions
  cssminOptions?: CssminOptionsType
  /**
   * 生成代码 参考 https://swc.rs/docs/configuring-swc#jsctarget
   */
  target?: JscTarget
  /**
   * 注入兼容代码
   * module federation 入口 建议使用  entry
   * @default false
   */
  polyfill?: PolyfillType
  /**
   * swc 配置
   */
  swcConfig?: {
    transform?: {
      useDefineForClassFields?: boolean
    }
    preserveAllComments?: boolean
  }
}
export type JscTarget =
  | 'es3'
  | 'es5'
  | 'es2015'
  | 'es2016'
  | 'es2017'
  | 'es2018'
  | 'es2019'
  | 'es2020'
  | 'es2021'
  | 'es2022'

export interface HtmlType extends HtmlRspackPluginOptions {
  /**
   * 基于项目的根目录 index.html url
   * @default src/index.html
   */
  template?: string
  /**
   * 基于项目的根目录 favicon url
   * @default src/favicon.ico
   */
  favicon?: string
  /**
   * 网站语言
   */
  lang?: string
  /**
   * externals 文件插入到html
   */
  tags?: InjectTagsTypeItem[]
  templateParameters?: any
  cache?: boolean
  /**
   * 注入的 js 文件
   * @default []
   */
}
//
export type EntriesType = {[entryFilename: string]: HtmlType}
//
export interface ModuleTransform {
  exclude?: RuleSetRule['exclude'][]
  include?: RuleSetRule['include'][]
  /**
   * 默认exclude /(node_modules|bower_components)/
   * @default false
   */
  defaultExclude?: boolean
}
export type CssSassOptionsType = {
  api?: 'modern' | 'modern-compiler'
  sassOptions?: SassOptions<'async'>
  mode?: 'default' | 'modern' | 'legacy'
  implementation?: object | string
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
//
export type RsTarget = RsConfig['target']
export type AutoPagesType = {
  /**
   * 基于src寻找入口目录
   * @default pages
   */
  path?: string
}
export type EmpOptions = {
  /**
   * publicPath 根路径 可参考webpack,业务模式默认为 auto
   * html 部分 publicPath 默认为 undefined,可设置全量域名或子目录适配，也可以单独在html设置 Public
   *
   * @default undefined
   */
  base?: string
  /**
   * 构建target
   */
  target?: RsConfig['target']
  /**
   * 启动后 自动设置 base 为当前 Ip+port的路径如 base = http://127.0.0.1:8080/ 并且固定 ws 方便代理调试
   */
  autoDevBase?: boolean
  /**
   * 启动后 进入自动搜寻入口的方式
   * 可以通过 html 或 entries 设置 模版配置
   */
  autoPages?: boolean | AutoPagesType
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
  build?: BuildType
  plugins?: EMP3PluginType[]
  html?: HtmlType
  entries?: EntriesType
  server?: ServerType
  debug?: DebugType
  chain?: (chain: Chain) => void
  /**
   * css 相关设置
   * @argument sass default {mode: 'modern'}
   */
  css?: {
    sass?: CssSassOptionsType & {
      webpackImporter?: boolean
      warnRuleAsWarning?: boolean
    }
    prifixName?: string
  }
  /**
   * 模块编译
   * 如 node_modules 模块 是否加入编译
   */
  moduleTransform?: ModuleTransform
  /**
   * 缓存目录
   * @default 'node_modules/.emp-cache'
   */
  cacheDir?: string
  /**
   * 启用缓存
   * @default persistent 为 内存缓存 false 关闭 persistent 持久缓存
   */
  cache?: boolean | 'persistent'
  /**
   * 全局环境替换
   */
  define?: Record<string, any>
  /**
   * 是否创建 cjs 的 process.env 或者 esm 的 import.meta.env
   * all 两者创建
   * esm 创建 import.meta.env
   * cjs 创建 process.env
   * none 不创建
   * @default cjs
   */
  defineFix?: 'all' | 'esm' | 'cjs' | 'none'
  /**
   * externals
   */
  externals?: Externals
  /**
   * resolve
   */
  resolve?: Resolve
  /**
   * output
   */
  output?: Output
  /**
   * emp 执行周期
   */
  lifeCycle?: LifeCycleOptions
  /**
   * ignoreWarnings
   * @default [/Conflicting order/, /Failed to parse source map/]
   */
  ignoreWarnings?: RsConfig['ignoreWarnings']
  /**
   * 详情 https://github.com/rspack-contrib/ts-checker-rspack-plugin
   */
  tsCheckerRspackPlugin?: TsCheckerRspackPluginOptions | boolean
}
export type Override<What, With> = Omit<What, keyof With> & With
export type InjectTagsType = InjectTagsTypeItem[]
export type InjectTagsTypeItem = {
  pos?: 'head' | 'body'
} & Partial<HtmlTagObject>
