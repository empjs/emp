const webpack = require('webpack')
// const withReact = require('@efox/emp-react')
const withReact = require('../framework/react')
// const {tsCompile, requireFromString} = require('./compile')
// const {configRemotes} = require('./depend')
const fs = require('fs-extra')
const {multiEntriesByConfig} = require('./multiEntry')
const LibraryModel = require('./libraryModel')
const {checkRemote} = require('./paths')
const {measure} = require('./logger')

class RuntimeCompile {
  sp = {} //start 函数入参
  op = {} //emp-config 里函数入参
  wpc = {} // webpack编译后的值
  empConfig = {} // emp-config json配置
  remotePackageJson = {} //远程依赖
  constructor() {}
  async setup(args, config, env, paths) {
    const {
      empConfigPath,
      empPackageJsonPath,
      // isRemoteTsConfig,
    } = await measure('checkRemote', () => checkRemote())
    this.sp = {args, empPackageJsonPath, empConfigPath, config, env, paths}
    this.op = {...args, config, env, webpack}
    await this.setEmpConfig()
  }
  async setEmpConfig() {
    // await this.defaultRumtime()
    this.remotePackageJson = this.sp.empPackageJsonPath
      ? await fs.readJson(this.sp.empPackageJsonPath)
      : {dependencies: {}, devDependencies: {}}
    //
    if (this.sp.empConfigPath) {
      await this.runtimeWithJsConfig()
    }
  }
  async startCompile() {
    await this.defaultRumtime()
    // console.log('this.empConfig', this.empConfig, paths)
    if (this.empConfig.pages) this.multiEntriesConfig(this.sp.paths)
    // if (this.empConfig.library) this.libraryConfig(paths)
    this.wpc = this.sp.config.toConfig()
    this.afterEmpConfigRuntime()
    await this.runtimeLog()
    return {webpackConfig: this.wpc, empConfig: this.empConfig || {}}
  }
  /**
   * 库模式化
   */
  libraryConfig(paths) {
    new LibraryModel(this.op.config, this.empConfig.library, paths)
  }
  /**
   * 多入口配置
   */
  multiEntriesConfig(paths) {
    let isMinify = false
    if (this.op.env === 'production' && this.op.minify !== false) isMinify = true
    multiEntriesByConfig(this.op.config, paths, this.empConfig.pages, isMinify)
  }
  /**
   * webpackchain 编译后的操作
   */
  afterEmpConfigRuntime() {}
  //
  isReact() {
    return (
      !!this.remotePackageJson.dependencies.react &&
      !this.remotePackageJson.devDependencies['@efox/emp-react'] &&
      !this.remotePackageJson.dependencies['@efox/emp-react']
    )
  }

  async defaultRumtime() {
    // this.remotePackageJson = this.sp.empPackageJsonPath
    //   ? await fs.readJson(this.sp.empPackageJsonPath)
    //   : {dependencies: {}, devDependencies: {}}
    // //
    // if (this.sp.empConfigPath) {
    //   await this.runtimeWithJsConfig()
    // } /* else if (this.sp.empConfigPath && this.sp.isRemoteTsConfig) {
    //   // await this.runtimeWithTsConfig()
    //   throw new Error('use emp-config.js https://github.com/efoxTeam/emp/discussions/88#discussioncomment-583390')
    // } */ else {
    if (!this.sp.empConfigPath) {
      // 在没有 emp-config.js 的环境下执行
      if (this.remotePackageJson.dependencies.react) {
        withReact()(this.op)
      }
    } else {
      const remoteConfig = require(this.sp.empConfigPath)
      if (typeof remoteConfig === 'function') {
        if (this.isReact()) {
          await withReact(remoteConfig)(this.op)
        } else {
          await remoteConfig(this.op)
        }
      }
      if (Object.keys(this.empConfig).length > 0) {
        // this.empConfig = remoteConfig
        await this.runtimeWithJSON()
      }
    }
    //============清除 depend 逻辑=====================================
    // const configs = await configRemotes()
    // configs &&
    //   config.plugin('mf').tap(args => {
    //     const {remotes = {}} = args[0]
    //     args[0] = {
    //       ...args[0],
    //       remotes: {
    //         ...remotes,
    //         ...configs,
    //       },
    //     }
    //     return args
    //   })
  }
  /**
   * runtimeWithTsConfig
   */
  // async runtimeWithTsConfig() {
  //   this.empConfig = await tsCompile(this.sp.empConfigPath)
  //   await this.runtimeWithJSON()
  // }
  async runtimeWithJsConfig() {
    // let remoteConfig = await fs.readFile(this.sp.empConfigPath, 'utf8')
    // remoteConfig = requireFromString(remoteConfig, '')
    const remoteConfig = require(this.sp.empConfigPath)
    /* if (typeof remoteConfig === 'function') {
      if (this.isReact()) {
        await withReact(remoteConfig)(this.op)
      } else {
        await remoteConfig(this.op)
      }
    } */
    if (Object.keys(remoteConfig).length > 0) {
      this.empConfig = remoteConfig
      // await this.runtimeWithJSON()
    }
  }
  async runtimeWithJSON() {
    // json 模型下 函数入参
    const op = {
      webpackEnv: this.op.env,
      webpackChain: this.sp.config,
      ...this.op,
    }
    if (this.isReact() && (!this.empConfig.framework || this.empConfig.framework.indexOf(withReact) === -1)) {
      await withReact()(this.op)
    }
    // emp plugin framework like react vue svetle and more
    if (this.empConfig.framework && this.empConfig.framework.length > 0) {
      this.empConfig.framework.map(fn => fn()(this.op))
    }
    // emp plugin compile like swc esbuild
    if (this.empConfig.compile && this.empConfig.compile.length > 0) {
      this.empConfig.compile.map(fn => fn()(this.op))
    }
    // emp module federation
    if (this.empConfig.moduleFederation) {
      const moduleFederation =
        typeof this.empConfig.moduleFederation === 'function'
          ? await this.empConfig.moduleFederation(op)
          : this.empConfig.moduleFederation
      this.sp.config.plugin('mf').tap(args => {
        args[0] = {
          ...args[0],
          ...moduleFederation,
        }
        return args
      })
    }
    // emp webpack chain
    if (this.empConfig.webpackChain && typeof this.empConfig.webpackChain === 'function') {
      await this.empConfig.webpackChain(this.sp.config, this.op)
    }
    // emp webpack
    if (this.empConfig.webpack && typeof this.empConfig.webpack === 'function') {
      const wpc = await this.empConfig.webpack(op)
      this.sp.config.merge(wpc)
    }
    // this.moduleGenerator
    if (this.empConfig.moduleGenerator) {
      // this.moduleGenerator = this.empConfig.moduleGenerator
      const moduleGenerator =
        typeof this.empConfig.moduleGenerator === 'function'
          ? await this.empConfig.moduleGenerator(op)
          : this.empConfig.moduleGenerator
      if (typeof moduleGenerator === 'string') {
        this.sp.config.merge({
          module: {
            generator: {
              'asset/resource': {
                publicPath: moduleGenerator,
              },
            },
          },
        })
      } else {
        this.sp.config.merge({module: {generator: moduleGenerator}})
      }
    }
  }

  async runtimeLog() {
    if (this.sp.args.wplogger) {
      if (typeof this.sp.args.wplogger === 'string') {
        const fileName = this.sp.args.wplogger
        try {
          // webpack.config.js
          await fs.writeFile(resolveApp(fileName), `module.exports=${JSON.stringify(this.wpc, null, 2)}`)
        } catch (err) {
          console.error(err)
        }
      } else {
        console.log('webpack config', this.sp.config.toString(), '==========')
      }
    }
    // 取消继承 minimizer TerserPlugin 让压缩更具定制化
    // if (env === 'production') wpc.optimization.minimizer.push('...')
  }
}

module.exports = new RuntimeCompile()
