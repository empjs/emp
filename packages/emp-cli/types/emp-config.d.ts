import {Configuration, container} from 'webpack/types'
import {WebpackDevServer} from './webpack-dev-server-4'
import * as webpackChain from 'webpack-chain/types'
import {Command} from 'commander/typings/index'
type MFOptions = ConstructorParameters<typeof container.ModuleFederationPlugin>[0]
type GeneratorOptType = Partial<Configuration>['module']['generator']
interface EmpConfigIBase {
  /** webpack */
  // webpack: webpack
  /** webpack config */
  // webpackConfig: WebpackOptionsNormalized
  /** webpack chain */
  webpackChain: webpackChain
  /** emp dev|start --env : env===empEnv */
  empEnv: string
  /** webpack build env */
  webpackEnv: 'development' | 'production'
}
/**
  '-s, --src <src>', '目标文件 默认为 src/index.ts
  '-pc, --public <public>', '目标 默认为 public/
  '-e, --env <env>', '部署环境 dev、test、prod 默认为 dev
  '-h, --hot', '是否使用热更新 默认不启动
  '-o, --open <open>', '是否打开调试页面 默认true,false禁止自动打开
  '-t, --ts', '生成类型文件 默认为 false
  '-ps, --progress', '显示进度 默认为 true
  '-wl, --wplogger [filename]', '打印webpack配置 默认为 false,filename 为 输出webpack配置文件
  '-rm, --remote', '在执行命令时拉取远程声明文件，远程地址首选package.json里的remoteBaseUrlList
  '-d, --dist <dist>', '目标 默认为 dist/
  '-dc, --doc <doc>', '目标 默认为 doc/
  '-a, --analyze', '生成分析报告 默认为 false
  '-n, --createName <createName>', '文件名 默认为 index.d.ts [* 使用默认值方便同步]
  '-p, --createPath <createPath>', '相对命令行目录 默认为 dist
 */
interface EmpConfigI {
  open?: boolean
  progress?: boolean
  src?: string
  public?: string
  hot?: boolean
  ts?: boolean
  wplogger?: boolean | string
  remote?: string
  dist?: string
  doc?: string
  analyze?: boolean
  createName?: string
  createPath?: string
}
/**
 * 路由 url 如 info/user 或 about 等 映射特殊配置到页面
 * 如: root 为 src/pages 的话 全路径 src/pages/info/user 配置成 如下配置
 * {
 *  'info/user':{title:"用户管理页面",favicon:"./src/assets/favicon.ico"}
 * }
 */
interface MultiPagesConfigRouter {
  [key: string]: {
    title: string
    template?: string
    favicon?: string
    files?: {
      css?: string[]
      js?: string[]
      publicPath?: string
    }
  }
}
interface MultiPagesConfig {
  router?: MultiPagesConfigRouter
  root?: string //default src/pages
}
interface WebpackConfigI extends Configuration {
  devServer?: WebpackDevServer
}
type ModuleFederationFuncType = (o: EmpConfigI & EmpConfigIBase) => MFOptions | Promise<MFOptions>
type ModuleFederationType = MFOptions | ModuleFederationFuncType
//
type ModuleGeneratorFuncType = (o: EmpConfigI & EmpConfigIBase) => string | GeneratorOptType | Promise<GeneratorOptType>
type ModuleGeneratorType = string | GeneratorOptType | ModuleGeneratorFuncType
//
declare interface EMPConfig {
  /** webpack & webpack chain config method */
  webpack?: (o: EmpConfigI & EmpConfigIBase) => WebpackConfigI | Promise<WebpackConfigI>
  webpackChain?: (config: webpackChain, o: EmpConfigI) => void | Promise<any>
  /**
   * compile replace babel use swc or esbuild
   * 拓展 swc、build 替换 babel进行构建
   */
  compile?: Array<any>
  /**
   * react vue svetle and more
   * 拓展 js 框架支持
   */
  framework?: Array<any>
  /**
   * module federation config
   * module federation 设置
   */
  moduleFederation?: ModuleFederationType
  /**
   * global assets path
   * when output.publicPath=auto & use module federation,need setting this option
   * 当 output.publicPath=auto时 自定义静态文件路径
   */
  moduleGenerator?: ModuleGeneratorType
  /**
   * 多入口支持 自定义支持
   */
  pages?: MultiPagesConfig
  /**
   * 弃置
   * 默认多页面入口
   * default src/pages
   * 当为 false 时 将不启动 多入口
   */
  // entryCwd?: string | boolean
  /**
   * style command of emp
   * 命令行拓展
   */
  commander?: (program: Command) => void
  /**
   * before dev env = development server
   * emp dev 启动前执行
   */
  beforeDev?: (config: EmpConfigI) => void | Promise<any>
  /**
   * before build env = production server
   * emp build 启动前执行
   */
  beforeBuild?: (config: EmpConfigI) => void | Promise<any>
  /**
   * isRegisterCommand = false
   * 是否检测全局注册命令、默认为 false，开启可以动态注册全局，但是会降低启动速度
   */
  isRegisterCommand?: boolean
}
