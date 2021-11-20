import fs from 'fs-extra'
import path from 'path'
import {cliOptionsType, modeType, pkgType} from 'src/types'
import {EMPConfigExport, initConfig, ResovleConfig} from 'src/config'
import logger from './logger'
import EMPShare from 'src/config/empShare'
import {vCompare} from 'src/helper/utils'
class GlobalStore {
  /**
   * EMP Version
   * @default package version
   */
  public pkg: pkgType = {dependencies: {}, devDependencies: {}, version: '2.0.0'}
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
  public cliOptions: cliOptionsType = {}
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
  async setup(mode: modeType, cliOptions: cliOptionsType, pkg: any) {
    //初始化 pkg
    this.pkg = {...this.pkg, ...pkg}
    //
    this.setConfig(mode, cliOptions)
    // check IsESM
    this.isESM = ['es3', 'es5'].indexOf(this.config.build.target) === -1
    //设置绝对路径
    this.setAbsPaths()
    // command option 处理 优先级优于 emp-config,把 config覆盖
    this.setCliOptions(cliOptions)
    // empShare 初始化
    await this.empShare.setup()
  }
  setCliOptions(cliOptions: cliOptionsType) {
    this.cliOptions = cliOptions
    if (this.cliOptions.wplogger) logger.info('[emp-config]', this.config)
    if (this.cliOptions.open) this.config.server.open = true
    if (this.cliOptions.hot) this.config.server.hot = true
  }
  setAbsPaths() {
    //
    this.appSrc = this.resolve(this.config.appSrc)
    this.outDir = this.resolve(this.config.build.outDir)
    this.publicDir = this.resolve(this.config.publicDir)
    this.cacheDir = this.resolve(this.config.cacheDir)
  }
  async setConfig(mode: modeType, cliOptions: cliOptionsType) {
    //初始化 emp-config.js
    const fp = this.resolve('emp-config.js')
    if (fs.existsSync(fp)) {
      const configExport: EMPConfigExport = require(fp)
      if (typeof configExport === 'function') {
        const conf = await configExport({mode})
        this.config = initConfig(conf, mode, cliOptions)
      } else if (typeof configExport === 'object') {
        const conf: any = configExport
        this.config = initConfig(conf, mode, cliOptions)
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
