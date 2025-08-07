import fs from 'node:fs/promises'
import path from 'node:path'
import util from 'node:util'
import type {Configuration as RsConfig, RspackOptions} from '@rspack/core'
import {rspack} from '@rspack/core'
import {getEmpConfigPath, getTsConfig} from 'src/helper/loadConfig'
import logger from 'src/helper/logger'
import {deepAssign, getLanIp, vCompare} from 'src/helper/utils'
import {Chain} from 'src/store/chain'
import empConfig, {type EmpConfig} from 'src/store/empConfig'
import rspackStore from 'src/store/rspack'
import {StoreServer} from 'src/store/server'
import type {EmpOptions, InjectTagsType, StoreRootPaths} from 'src/types/config'
import type {CliActionType, EMPModeType} from 'src/types/env'
import {chainName} from './chain'
import {HtmlEmpInjectPlugin} from './rspack/builtInPlugin'
export class GlobalStore {
  public rspack = rspack
  public rspackVersion = rspack.rspackVersion
  public isOldRspack = vCompare(this.rspackVersion, '1.0.0') === -1
  /**
   * EMP Version
   * @default package version
   */
  public empPkg: any = {dependencies: {}, devDependencies: {}, version: '2.0.0', name: ''}
  /**
   * 项目pkg信息
   */
  public pkg: any = {dependencies: {}, devDependencies: {}, version: '0.0.0', name: ''}
  /**
   * 项目根目录绝对路径
   * @default process.cwd()
   */
  public root = process.cwd()
  /**
   * emp 内部根路径
   * @default empRoot
   */
  public empRoot = path.resolve(__dirname, __filename).replace(`${path.sep}dist${path.sep}index.js`, '')
  /**
   * emp 执行代码路径
   */
  public empSource = path.resolve(this.empRoot, 'dist')
  /**
   * 获取项目 根目录绝对路径
   * (*) relativePath 可以是绝对路径
   * @param relativePath
   * @returns
   */
  public resolve = (relativePath: string) =>
    path.isAbsolute(relativePath) ? relativePath : path.resolve(this.root, relativePath)
  /**
   * 获取项目 emp内部根目录绝对路径
   * @param relativePath
   * @returns
   */
  public empResolve = (relativePath: string) => path.resolve(this.empRoot, relativePath)

  /**
   * 源码地址 绝对路径
   */
  public appSrc = ''
  /**
   * 源码生成目录 绝对路径
   */
  public outDir = ''
  /**
   * 静态文件目录 绝对路径
   */
  public publicDir = ''
  /**
   * 静态资源
   */
  public resource = {
    dir: '',
    key: '',
    cert: '',
  }
  /**
   * chain 配置相关
   */
  public chainName = chainName
  /**
   * server 配置相关
   */
  public server: StoreServer = new StoreServer(this)
  /**
   * 缓存目录 绝对路径
   */
  public cacheDir = ''
  public mode: EMPModeType = 'development'
  public cliMode: 'dev' | 'prod' = 'dev'
  public isDev = true
  /**
   * 项目配置
   */
  public cliOptions: any
  public chain!: Chain
  public rsConfig!: RsConfig
  public empOptions: EmpOptions = {}
  public empConfig!: EmpConfig
  // 拓展
  public entries: {[chunkName: string]: RspackOptions['entry']} = {} // 获取所有入口名称
  public debug!: EmpConfig['debug']
  public cliAction!: CliActionType
  // 获取 emp-config路径 以及 tsconfig 路径
  public rootPaths: StoreRootPaths = {
    empConfig: undefined,
    tsConfig: undefined,
    pkg: undefined,
  }
  public async setup(cliAction: CliActionType, cliOptions: any) {
    logger.time('[store]Setup')
    //
    const [epath, tpath] = await Promise.all([getEmpConfigPath(), getTsConfig()])
    this.rootPaths.empConfig = epath
    this.rootPaths.tsConfig = tpath
    this.rootPaths.pkg = this.resolve('package.json')
    // console.log('this.rootPaths', this.rootPaths)
    //
    // 初始化 store 基础变量
    await this.initVars(cliAction, cliOptions)
    // 设置 empConfig
    this.empConfig = empConfig
    await this.empConfig.setup(this)
    this.debug = {...{}, ...this.empConfig.debug}
    // 初始化 store 绝对路径
    this.initPaths()
    // chain 实例化
    this.chain = new Chain()
    // rspack setup
    await rspackStore.setup(this)
    //
    this.setLogger()
    this.toConfig()
    this.logConfig()
    // 根据配置适配 devServer 配置
    await this.server.setupOnStore()
    //
    logger.timeEnd('[store]Setup')
  }
  /**
   * 初始化 基础变量
   * @param mode cli名称
   * @param cliOptions cli配置
   */
  private async initVars(cliAction: CliActionType, cliOptions: any) {
    this.cliAction = cliAction
    this.cliOptions = cliOptions || {}
    this.cliMode = process.env.ENV as 'dev' | 'prod'
    this.mode = cliAction === 'dev' ? 'development' : 'production'
    this.isDev = this.mode === 'development'
    // 适配所有插件的构建环境
    process.env['NODE_ENV'] = cliAction === 'dev' ? 'development' : 'production'
    //
    const empPkg = require(this.empResolve('package.json'))
    const pkg = require(this.resolve('package.json'))
    this.empPkg = {...this.empPkg, ...empPkg}
    this.pkg = {...this.pkg, ...pkg}
    // init resource path
    this.resource.dir = path.join(this.empRoot, 'resource')
    this.resource.cert = path.join(this.resource.dir, 'emp.cert')
    this.resource.key = path.join(this.resource.dir, 'emp.key')
  }
  /**
   * 初始化 基础路径
   */
  private initPaths() {
    this.appSrc = this.resolve(this.empConfig.appSrc)
    this.outDir = this.resolve(this.empConfig.build.outDir)
    this.publicDir = this.resolve(this.empConfig.build.publicDir)
    this.cacheDir = this.resolve(this.empConfig.cacheDir)
  }
  /**
   * 设置 日志等级
   */
  private loggerExtensionName = ''
  public setLoggerExtensionName(name: string) {
    this.loggerExtensionName = name
  }
  public setLogger() {
    let logLevel = this.cliMode === 'dev' ? 'debug' : 'info'
    if (this.debug.loggerLevel) logLevel = this.debug.loggerLevel
    logger.setup({
      fullName: `EMP⚡${this.empPkg.version}${this.cliMode === 'dev' ? '.DEV' : ''}${this.loggerExtensionName ? ' ' + this.loggerExtensionName : ''}`,
      brandName: `EMP`,
      logLevel,
    })
  }
  public merge(o: RspackOptions) {
    this.chain.merge(o)
  }
  /**
   * 同步 chain 配置到 rsConfig
   */
  public toConfig() {
    this.rsConfig = this.chain.toConfig() as RsConfig
  }
  /**
   * 打印 config
   */
  public logConfig() {
    if (this.debug.showRsconfig) {
      if (typeof this.debug.showRsconfig === 'string') {
        const rsconfigPath = path.join(this.root, this.debug.showRsconfig)
        fs.writeFile(rsconfigPath, JSON.stringify(this.rsConfig, null, 2))
      } else {
        this.debug.clearLog = false // 防止清空显示配置
        const defaultOp = {colors: true, depth: null}
        const op: any =
          typeof this.debug.showRsconfig === 'object' ? deepAssign(defaultOp, this.debug.showRsconfig) : defaultOp
        console.log(logger.link(`[Compile Config]`))
        console.log(util.inspect(this.rsConfig, op))
      }
    }
  }
  get browserslistOptions() {
    return {
      default: ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'],
      h5: ['iOS >= 9', 'Android >= 4.4', 'last 2 versions', '> 0.2%', 'not dead'],
      node: ['node >= 16'],
    }
  }
  get uniqueName(): string {
    return this.encodeVarName(this.pkg.name)
  }
  encodeVarName(name: string): string {
    return name.replaceAll('/', '_').replaceAll('@', '_').replaceAll('-', '_')
  }
  // utils
  public vCompare = vCompare
  public deepAssign = deepAssign
  public getLanIp = getLanIp
  public injectTags(o: InjectTagsType = [], name = '', chunk = '') {
    this.chain.plugin(`${HtmlEmpInjectPlugin}-${name}`).use(HtmlEmpInjectPlugin, [o, name, chunk])
  }
}
export default new GlobalStore()
