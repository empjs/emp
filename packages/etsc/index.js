const path = require('path')
const glob = require('tiny-glob')
const rimraf = require('rimraf')
const fs = require('fs-extra')
const logger = require('./helper/logger')
const esbuild = require('./helper/esbuild')
//
class Etsc {
  constructor() {
    this.mode = 'none'
    this.clioptions = {}
    this.root = process.cwd()
  }
  async exec(mode, clioptions) {
    this.mode = mode
    this.watch = mode === 'development' ? true : false
    //
    logger(`compile env ${mode}.`, 'black')
    //
    this.resetConfig()
    //
    await this.setTs()
    //
    this.setCli(clioptions)
    //
    await this.setAbPath()
    //
    this.cleanOutDir()
    //
    this.build()
  }
  cleanOutDir() {
    rimraf.sync(this.outdir)
  }
  resetConfig() {
    this.src = 'src'
    this.outdir = 'dist'
    this.target = 'es2018'
    this.format = 'cjs'
    this.platform = 'node'
  }
  moduleToEsbuild(module) {
    if (module === 'commonjs') {
      return 'cjs'
    } else {
      return 'esm'
    }
  }
  async setAbPath() {
    this.appSrc = path.resolve(this.root, this.src)
    this.outputSourceDir = path.resolve(this.root, this.outdir)
    this.entryPoints = await glob(path.join(this.appSrc, '**/**.*'))
  }
  async setTs() {
    const tsconfigPath = path.resolve(this.root, 'tsconfig.json')
    const isExistTsconfig = await fs.pathExists(tsconfigPath)
    if (isExistTsconfig) {
      const tsg = require(tsconfigPath)
      const compilerOptions = tsg.compilerOptions || {}
      const {outDir, target, module, moduleResolution, sourceMap} = compilerOptions
      if (outDir) this.outdir = outDir.toLowerCase()
      if (target) this.target = target.toLowerCase()
      if (module) this.format = this.moduleToEsbuild(module.toLowerCase())
      if (moduleResolution) this.platform = moduleResolution.toLowerCase()
      if (typeof sourceMap !== 'undefined') this.sourcemap = sourceMap
      //
      this.tsconfig = tsconfigPath
    } else {
      this.tsconfig = path.resolve(__dirname, 'tsconfig.base.json')
    }
  }
  setCli(clioptions = {}) {
    if (clioptions.src) this.src = clioptions.src
    if (clioptions.outdir) this.outdir = clioptions.outdir
    if (clioptions.target) this.target = clioptions.target
    if (clioptions.format) this.format = clioptions.format
    if (clioptions.platform) this.platform = clioptions.platform
    if (typeof clioptions.sourcemap !== 'undefined') this.sourcemap = clioptions.sourcemap
    this.minify = clioptions.minify === true ? true : false
    this.bundle = clioptions.bundle === true ? true : false
    this.logLevel = clioptions.logLevel || 'debug'
    this.debug = clioptions.debug === true ? true : false
  }
  build() {
    return esbuild(this)
  }
}

module.exports = new Etsc()