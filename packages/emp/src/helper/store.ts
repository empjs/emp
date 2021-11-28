import fs from 'fs-extra'
import path from 'path'
import {cliOptionsType, ConfigDebugType, modeType, pkgType} from 'src/types'
import {EMPConfigExport, initConfig, ResovleConfig} from 'src/config'
import logger from './logger'
import EMPShare from 'src/config/empShare'
import {vCompare} from 'src/helper/utils'
class GlobalStore {
  /**
   * EMP Version
   * @default package version
   */
  public empPkg: pkgType = {dependencies: {}, devDependencies: {}, version: '2.0.0'}
  /**
   * 项目pkg信息
   */
  public pkg: pkgType = {dependencies: {}, devDependencies: {}, version: '0.0.0'}
  /**
   * 项目根目录绝对路径
   * @default process.cwd()
   */
  public root = process.cwd()
  /**
   * emp 内部根路径
   * @default path.resolve(__dirname, '../../')
   */
  public empRoot = path.resolve(__dirname, '../../')
  /**
   * emp 执行代码路径
   */
  public empSource = path.resolve(this.empRoot, 'dist')
  /**
   * 项目配置
   */
  public config: ResovleConfig = initConfig()
  /**
   * 获取项目 根目录绝对路径
   * @param relativePath
   * @returns
   */
  public resolve = (relativePath: string) => path.resolve(this.root, relativePath)
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
   * 缓存目录 绝对路径
   */
  public cacheDir = ''
  /**
   * 命令行变量
   */
  // public cliOptions: cliOptionsType = {}
  /**
   * 是否 ESM 模块
   */
  public isESM = false
  public empShare = new EMPShare()

  constructor() {}
  /**
   * setConfig 设置全局配置
   * @param mode webpack mode
   * @param cliOptions command options
   * @param pkg package.json data
   */
  async setup(mode: modeType, cliOptions: cliOptionsType, empPkg: any) {
    //初始化 emp pkg 暂时不获取依赖
    this.empPkg = {...this.empPkg, ...{version: empPkg.version}}
    // 项目 package.json
    this.pkg = require(this.resolve('package.json'))
    //
    await this.setConfig(mode, cliOptions)
    //初始化 构建 模式 环境变量
    this.config.mode = mode
    this.config.env = cliOptions.env
    // check IsESM
    this.isESM = ['es3', 'es5'].indexOf(this.config.build.target) === -1
    //设置绝对路径
    this.setAbsPaths()
    // 根据 cliOptions 覆盖 config
    this.setConfigByCliPotions(cliOptions)
    // empShare 初始化
    await this.empShare.setup()
    //show logger of config
    if (this.config.debug.wplogger) logger.info('[emp-config]', this.config)
  }
  private setAbsPaths() {
    //
    this.appSrc = this.resolve(this.config.appSrc)
    this.outDir = this.resolve(this.config.build.outDir)
    this.publicDir = this.resolve(this.config.publicDir)
    this.cacheDir = this.resolve(this.config.cacheDir)
  }
  /**
   * 覆盖 config 配置
   */
  private setConfigByCliPotions(cliOptions: cliOptionsType) {
    // debug 替换配置项
    if (cliOptions.clearLog === 'false' || cliOptions.clearLog === false) this.config.debug.clearLog = false
    if (cliOptions.profile === true) this.config.debug.profile = true
    if (cliOptions.wplogger === true) this.config.debug.wplogger = true
    if (cliOptions.progress === 'false' || cliOptions.progress === false) this.config.debug.progress = false
    // server build 替换配置项
    if (cliOptions.open === true) this.config.server.open = true
    if (cliOptions.hot === false) this.config.server.hot = false
    if (cliOptions.analyze === true) this.config.build.analyze = true
  }
  private async setConfig(mode: modeType, cliOptions: cliOptionsType) {
    //初始化 emp-config.js
    const fp = this.resolve('emp-config.js')
    if (fs.existsSync(fp)) {
      const configExport: EMPConfigExport = require(fp)
      if (typeof configExport === 'function') {
        const conf = await configExport({mode, ...cliOptions})
        this.config = initConfig(conf)
      } else if (typeof configExport === 'object') {
        const conf: any = configExport
        this.config = initConfig(conf)
      }
    }
    // reactRuntime settings
    const version = this.pkg.dependencies.react || this.pkg.devDependencies.react
    if (version) {
      this.config.reactRuntime = vCompare(version, '17') > -1 ? 'automatic' : 'classic'
    }
  }
}
export default new GlobalStore()
