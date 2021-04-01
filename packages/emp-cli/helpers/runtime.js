const webpack = require('webpack')
const withReact = require('@efox/emp-react')
const {tsCompile, requireFromString} = require('./compile')
const {configRemotes} = require('./depend')
const fs = require('fs-extra')

class RuntimeCompile {
  async startCompile(args, empPackageJsonPath, empConfigPath, config, env, isRemoteTsConfig) {
    // this.moduleGenerator = false
    await this.defaultRumtime(args, empPackageJsonPath, empConfigPath, config, env, isRemoteTsConfig)
    const wpc = config.toConfig()
    this.afterEmpConfigRuntime(wpc, args, env)
    await this.runtimeLog(args, wpc, config)
    return wpc
  }
  /**
   * webpackchain 编译后的操作
   * @param {*} wpc 编译后的内容
   * @param {*} args cli入参
   * @param {*} env webpack 环境
   */
  afterEmpConfigRuntime(wpc, args, env) {}
  //
  isReact(remotePackageJson) {
    return (
      !!remotePackageJson.dependencies.react &&
      !remotePackageJson.devDependencies['@efox/emp-react'] &&
      !remotePackageJson.dependencies['@efox/emp-react']
    )
  }

  async defaultRumtime(args, empPackageJsonPath, empConfigPath, config, env, isRemoteTsConfig) {
    const empConfOpt = {...args, config, env, webpack}
    const remotePackageJson = empPackageJsonPath
      ? await fs.readJson(empPackageJsonPath)
      : {dependencies: {}, devDependencies: {}}
    //
    if (empConfigPath && !isRemoteTsConfig) {
      await this.runtimeWithJsConfig(remotePackageJson, empConfigPath, empConfOpt, config)
    } else if (empConfigPath && isRemoteTsConfig) {
      await this.runtimeWithTsConfig(remotePackageJson, empConfigPath, empConfOpt, config)
    } else {
      // 在没有 emp-config.js 的环境下执行
      if (remotePackageJson.dependencies.react) {
        withReact()(empConfOpt)
      }
    }
    const configs = await configRemotes()
    configs &&
      config.plugin('mf').tap(args => {
        const {remotes = {}} = args[0]
        args[0] = {
          ...args[0],
          remotes: {
            ...remotes,
            ...configs,
          },
        }
        return args
      })
  }
  async runtimeWithTsConfig(remotePackageJson, empConfigPath, empConfOpt, config) {
    let remoteTsConfig = await fs.readFile(empConfigPath, 'utf8')
    remoteTsConfig = await tsCompile(remoteTsConfig, empConfigPath)
    remoteTsConfig = requireFromString(remoteTsConfig, empConfigPath)
    remoteTsConfig = remoteTsConfig.default
    //
    const empConfigAll = {
      // webpackConfig,
      webpackEnv: empConfOpt.env,
      webpackChain: config,
      ...empConfOpt,
    }
    //::TODO 实例化代码配置
    if (
      this.isReact(remotePackageJson) &&
      (!remoteTsConfig.framework || remoteTsConfig.framework.indexOf(withReact) === -1)
    ) {
      await withReact()(empConfOpt)
    }
    // emp plugin framework like react vue svetle and more
    if (remoteTsConfig.framework && remoteTsConfig.framework.length > 0) {
      remoteTsConfig.framework.map(fn => fn()(empConfOpt))
    }
    // emp plugin compile like swc esbuild
    if (remoteTsConfig.compile && remoteTsConfig.compile.length > 0) {
      remoteTsConfig.compile.map(fn => fn()(empConfOpt))
    }
    // emp module federation
    if (remoteTsConfig.moduleFederation) {
      const moduleFederation =
        typeof remoteTsConfig.moduleFederation === 'function'
          ? await remoteTsConfig.moduleFederation(empConfigAll)
          : remoteTsConfig.moduleFederation
      config.plugin('mf').tap(args => {
        args[0] = {
          ...args[0],
          ...moduleFederation,
        }
        return args
      })
    }
    // emp webpack chain
    if (remoteTsConfig.webpackChain && typeof remoteTsConfig.webpackChain === 'function') {
      await remoteTsConfig.webpackChain(config, empConfOpt)
    }
    // emp webpack
    if (remoteTsConfig.webpack && typeof remoteTsConfig.webpack === 'function') {
      const wpc = await remoteTsConfig.webpack(empConfigAll)
      config.merge(wpc)
    }
    // this.moduleGenerator
    if (remoteTsConfig.moduleGenerator) {
      // this.moduleGenerator = remoteTsConfig.moduleGenerator
      const moduleGenerator =
        typeof remoteTsConfig.moduleGenerator === 'function'
          ? await remoteTsConfig.moduleGenerator(empConfigAll)
          : remoteTsConfig.moduleGenerator
      if (typeof moduleGenerator === 'string') {
        config.merge({
          module: {
            generator: {
              asset: {
                publicPath: moduleGenerator,
              },
            },
          },
        })
      } else {
        config.merge({module: {generator: moduleGenerator}})
      }
    }
  }
  async runtimeWithJsConfig(remotePackageJson, empConfigPath, empConfOpt, config) {
    let remoteConfigFn = await fs.readFile(empConfigPath, 'utf8')
    // remoteConfigFn = eval(remoteConfigFn)
    // console.log('remoteConfigFn', remoteConfigFn)
    remoteConfigFn = requireFromString(remoteConfigFn, '')
    if (this.isReact(remotePackageJson)) {
      await withReact(remoteConfigFn)(empConfOpt)
    } else {
      await remoteConfigFn(empConfOpt)
    }
  }

  async runtimeLog(args, wpc, config) {
    if (args.wplogger) {
      if (typeof args.wplogger === 'string') {
        const fileName = args.wplogger
        try {
          // webpack.config.js
          await fs.writeFile(resolveApp(fileName), `module.exports=${JSON.stringify(wpc, null, 2)}`)
        } catch (err) {
          console.error(err)
        }
      } else {
        console.log('webpack config', config.toString(), '==========')
      }
    }
    // 取消继承 minimizer TerserPlugin 让压缩更具定制化
    // if (env === 'production') wpc.optimization.minimizer.push('...')
  }
}

module.exports = new RuntimeCompile()
