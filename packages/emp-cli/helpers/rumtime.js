const webpack = require('webpack')
const withReact = require('@efox/emp-react')
const {tsCompile, requireFromString} = require('./compile')
const fs = require('fs-extra')
//
function isReact(remotePackageJson) {
  return (
    !!remotePackageJson.dependencies.react &&
    !remotePackageJson.devDependencies['@efox/emp-react'] &&
    !remotePackageJson.dependencies['@efox/emp-react']
  )
}

async function defaultRumtime(args, empPackageJsonPath, empConfigPath, config, env, isRemoteTsConfig) {
  const empConfOpt = {...args, config, env, webpack}
  const remotePackageJson = empPackageJsonPath
    ? await fs.readJson(empPackageJsonPath)
    : {dependencies: {}, devDependencies: {}}
  //
  if (empConfigPath && !isRemoteTsConfig) {
    await runtimeWithJsConfig(remotePackageJson, empConfigPath, empConfOpt, config)
  } else if (empConfigPath && isRemoteTsConfig) {
    await runtimeWithTsConfig(remotePackageJson, empConfigPath, empConfOpt, config)
  } else {
    // 在没有 emp-config.js 的环境下执行
    if (remotePackageJson.dependencies.react) {
      withReact()(empConfOpt)
    }
  }
}
async function runtimeWithTsConfig(remotePackageJson, empConfigPath, empConfOpt, config) {
  let remoteTsConfig = await fs.readFile(empConfigPath, 'utf8')
  remoteTsConfig = await tsCompile(remoteTsConfig)
  remoteTsConfig = requireFromString(remoteTsConfig.code, '')
  remoteTsConfig = remoteTsConfig.default
  //::TODO 实例化代码配置
  if (isReact(remotePackageJson) && (!remoteTsConfig.framework || remoteTsConfig.framework.indexOf(withReact) === -1)) {
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
    config.plugin('mf').tap(args => {
      args[0] = {
        ...args[0],
        ...remoteTsConfig.moduleFederation,
      }
      return args
    })
  }
  console.log('remoteTsConfig', remoteTsConfig)
  // emp webpack & webpack chain
  if (remoteTsConfig.webpackChain && typeof remoteTsConfig.webpackChain === 'function') {
    // const webpackConfig = config.toConfig()
    // const webpackConfWithEmpConfig = await remoteTsConfig.config({
    //   webpackConfig,
    //   webpackEnv: empConfOpt.env,
    //   webpackChain: config,
    //   ...empConfOpt.args,
    // })
    // config.merge(webpackConfWithEmpConfig)
    await remoteTsConfig.webpackChain(config, empConfOpt)
  }
}
async function runtimeWithJsConfig(remotePackageJson, empConfigPath, empConfOpt, config) {
  let remoteConfigFn = await fs.readFile(empConfigPath, 'utf8')
  remoteConfigFn = eval(remoteConfigFn)
  if (isReact(remotePackageJson)) {
    await withReact(remoteConfigFn)(empConfOpt)
  } else {
    await remoteConfigFn(empConfOpt)
  }
}

async function runtimeLog(args, wpc, config) {
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
module.exports = {defaultRumtime, runtimeLog}
