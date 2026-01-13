import type {InspectOptions} from 'node:util'
import type {RsdoctorRspackPlugin} from '@rsdoctor/rspack-plugin'
import type {
  DevServer as devServerConfig,
  ExperimentCacheOptions,
  Externals,
  HtmlRspackPluginOptions,
  // LightningCssMinimizerRspackPluginOptions,
  Output,
  Resolve,
  Configuration as RsConfig,
  RuleSetRule,
  SourceMapDevToolPluginOptions,
  // SwcCssMinimizerRspackPlugin,
  SwcJsMinimizerRspackPluginOptions,
} from '@rspack/core'
import type {HtmlTagObject} from 'html-webpack-plugin'
import type {Options as SassOptions} from 'sass-embedded'
import {Chain} from 'src/store/chain'
import type {LifeCycleOptions} from 'src/store/lifeCycle'
import type {TsCheckerRspackPluginOptions} from 'ts-checker-rspack-plugin/lib/plugin-options'
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
  /**
   * 已经弃用
   */
  showPerformance?: boolean
  showScriptDebug?: boolean
  //rspackCache 已弃用
  // rspackCache?: boolean
  rsdoctor?: boolean | RsdoctorRspackPluginOptions
  newTreeshaking?: boolean
  devShowAllLog?: boolean //显示所有错误 默认关闭
  warnRuleAsWarning?: boolean
  /**
   * 是否显示执行日志
   * @default false
   */
  infrastructureLogging?: RsConfig['infrastructureLogging']
  /**
   * 开启并行 code spitting
   * @default true
   */
  // parallelCodeSplitting?: boolean
  /**
   * https://rspack.rs/zh/plugins/rspack/css-chunking-plugin
   * 启用 CssChunkingPlugin 后，SplitChunksPlugin 将不再处理 CSS 模块。 这意味着 optimization.splitChunks 等配置对 CSS 模块将不再生效，所有 CSS 模块的代码分割逻辑完全由 CssChunkingPlugin 处理。
   */
  cssChunkingPlugin?: boolean
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
export type SourceMapType = {
  js: RsConfig['devtool'] | false
  css: boolean
  devToolPluginOptions?: SourceMapDevToolPluginOptions
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
  sourcemap?: boolean | SourceMapType
  /**
   * sourcemap 类型
   * 默认 source-map
   * @deprecated 请使用 build.sourcemap.js 设置
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
   * 是否用 ESM
   */
  useESM?: boolean
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
/**
 * Less 配置项
 *
 * 将 less-loader 的常用选项暴露到 empConfig.css.less，并提供 TS 提示。
 */
export type CssLessOptionsType = {
  /**
   * 传递给 less-loader 的 lessOptions。
   *
   * - `javascriptEnabled`: 允许在 Less 中使用 JS 表达式与函数。
   *   许多第三方 UI 库（如 Ant Design）在主题构建或函数型变量计算中需要开启。
   *   若关闭，可能导致变量计算/函数调用失败（构建报错或样式异常）。
   *   默认值：`true`。
   *
   * - `math`: 控制数学表达式解析策略（Less v4）。
   *   - `'always'`: 始终解析数学表达式（兼容旧 Less 裸除法写法，升级更平滑）。
   *   - `'parens-division'`: 仅在括号内解析除法，更安全的中间策略。
   *   - `'strict'`: 更严格的解析方式，需显式括号。
   *   默认值：`'always'`，用于提升对旧代码及部分生态的兼容性。
   */
  lessOptions?: {
    javascriptEnabled?: boolean
    math?: 'always' | 'parens-division' | 'strict'
  }
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
      additionalData?: string
    }
    /**
     * Less 配置
     *
     * 默认：`{ lessOptions: { javascriptEnabled: true, math: 'always' } }`
     * 如项目严格遵循 Less v4 新语法且不依赖 JS 表达式，可考虑：
     * - 将 `math` 调整为 `'parens-division'` 或 `'strict'`；
     * - 将 `javascriptEnabled` 设为 `false`。
     */
    less?: CssLessOptionsType
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
  cache?: boolean | 'persistent' | ExperimentCacheOptions
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
  /**
   * 是否显示日志标题
   * @default undefined
   */
  showLogTitle?: (o?: any) => void
}
export type Override<What, With> = Omit<What, keyof With> & With
export type InjectTagsType = InjectTagsTypeItem[]
export type InjectTagsTypeItem = {
  pos?: 'head' | 'body'
} & Partial<HtmlTagObject>

export type StoreRootPaths = {
  tsConfig?: string
  empConfig?: string
  pkg?: string
}
