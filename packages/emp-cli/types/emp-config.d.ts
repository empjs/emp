import {Configuration, container} from 'webpack/types'
import {WebpackDevServerI} from './webpack-dev-server'
import * as webpackChain from 'webpack-chain/types'
type MFOptions = ConstructorParameters<typeof container.ModuleFederationPlugin>[0]
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
interface WebpackConfigI extends Configuration {
  devServer?: WebpackDevServerI
}
type ModuleFederationFuncType = (o: EmpConfigI & EmpConfigIBase) => MFOptions | Promise<MFOptions>
type ModuleFederationType = MFOptions | ModuleFederationFuncType
//
declare interface EMPConfig {
  /** webpack & webpack chain config method */
  webpack?: (o: EmpConfigI & EmpConfigIBase) => WebpackConfigI | Promise<WebpackConfigI>
  webpackChain?: (config: webpackChain, o: EmpConfigI) => void | Promise<any>
  /** compile replace babel use swc or esbuild */
  compile?: Array<any>
  /** react vue svetle and more */
  framework?: Array<any>
  /** module federation config */
  moduleFederation?: ModuleFederationType
}
