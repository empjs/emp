import fs from 'fs-extra'
import path from 'path'
import {cliOptionsType, modeType, wpPathsType} from 'src/types'
import {EMPConfigExport, EMPConfig, initConfig, ResovleConfig} from 'src/config'
import logger from './logger'
class GlobalStore {
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
   * 项目配置
   */
  public config: ResovleConfig
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
   * 源码地址
   */
  public appSrc: string
  /**
   * 源码生成目录
   */
  public outDir: string
  /**
   * 静态文件目录
   */
  public publicDir: string
  /**
   * webpack 环境变量
   */
  public wpEnv: modeType
  /**
   * 命令行变量
   */
  public cliOptions: cliOptionsType = {}
  /**
   * webpack 文件路径
   */
  public wpPaths: wpPathsType = {output: {}}
  /**
   * 设置文件拓展
   */
  public extensions: string[] = []

  constructor() {
    this.config = initConfig()
    this.appSrc = this.resolve(this.config.appSrc)
    this.outDir = this.resolve(this.config.build.outDir)
    this.publicDir = this.resolve(this.config.publicDir)
  }
  async setConfig(webpackEnv: modeType, cliOptions: cliOptionsType) {
    this.wpEnv = webpackEnv || 'development'
    const fp = this.resolve('emp-config.js')
    if (fs.existsSync(fp)) {
      const configExport: EMPConfigExport = require(fp)
      if (typeof configExport === 'function') {
        const conf = await configExport()
        this.config = initConfig(conf)
      } else if (typeof configExport === 'object') {
        const conf: any = configExport
        this.config = initConfig(conf)
      }
    }
    this.appSrc = this.config.appSrc ? this.resolve(this.config.appSrc) : this.appSrc
    // command option 处理 优先级优于 emp-config,把 config覆盖
    this.cliOptions = cliOptions
    if (this.cliOptions.wplogger) logger.info('=== emp config ===', this.config)
    if (this.cliOptions.open) this.config.server.open = true
    if (this.cliOptions.hot) this.config.server.hot = true
    //
    this.setWpPaths()
    //
    this.setExtensions()
  }
  setWpPaths() {
    const environment =
      this.config.build.target === 'es5'
        ? {
            arrowFunction: false,
            bigIntLiteral: false,
            const: false,
            destructuring: false,
            forOf: false,
            dynamicImport: false,
            module: false,
          }
        : {}
    this.wpPaths = {
      output: {
        path: this.outDir,
        publicPath: this.config.build.useLib ? this.config.base : 'auto',
        filename: 'js/[name].[contenthash:8].js',
        assetModuleFilename: `${this.config.build.assetsDir}/[name].[contenthash:8][ext][query]`,
        environment,
        // scriptType: ['es3', 'es5'].indexOf(this.config.build.target) === -1 ? 'module' : 'text/javascript',
      },
    }
  }
  setExtensions() {
    this.extensions = [
      '.js',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.css',
      '.less',
      '.scss',
      '.sass',
      '.json',
      '.wasm',
      '.vue',
      '.svg',
      '.svga',
    ]
  }
}
export default new GlobalStore()
