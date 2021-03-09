const webpack = require('webpack')
const withReact = require('@efox/emp-react')
const fs = require('fs-extra')
//
async function defaultRumtime(args, empPackageJsonPath, empConfigPath, config, env, isRemoteTsConfig) {
  const empConfOpt = {...args, config, env, webpack}
  const remotePackageJson = empPackageJsonPath
    ? await fs.readJson(empPackageJsonPath)
    : {dependencies: {}, devDependencies: {}}
  //
  if (empConfigPath) {
    let remoteConfigFn = await fs.readFile(empConfigPath, 'utf8')
    remoteConfigFn = eval(remoteConfigFn)
    if (
      !!remotePackageJson.dependencies.react &&
      !remotePackageJson.devDependencies['@efox/emp-react'] &&
      !remotePackageJson.dependencies['@efox/emp-react']
    ) {
      await withReact(remoteConfigFn)(empConfOpt)
    } else {
      await remoteConfigFn(empConfOpt)
    }
  } else {
    // 在没有 emp-config.js 的环境下执行
    if (remotePackageJson.dependencies.react) {
      withReact()(empConfOpt)
    }
  }
}
async function runJsFuncEmpConfig(RemoteEMPConfig, isDefaultUseReact, o) {
  RemoteEMPConfig = eval(RemoteEMPConfig)
  if (isDefaultUseReact) {
    await withReact(RemoteEMPConfig)(o)
  } else {
    await RemoteEMPConfig(o)
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
