const fs = require('fs-extra')
const {resolveApp, appPackageJson} = require('../helpers/paths')
const Configs = require('webpack-chain')
const config = new Configs()
const webpack = require('webpack')
const withReact = require('@efox/emp-react')
module.exports = {
  async getProjectConfig(env, args) {
    args = args || {}
    require('../webpack/config/common')(env, config, args)
    require(`../webpack/config/${env}`)(args, config, env)
    const remoteConfig = resolveApp('emp-config.js')
    const [isRemoteConfig, isRemotePackageJson] = await Promise.all([
      fs.exists(remoteConfig),
      fs.exists(appPackageJson),
    ])
    const empEnv = args.empEnv
    const hot = !!args.hot
    const remotePackageJson = isRemotePackageJson
      ? await fs.readJson(appPackageJson)
      : {dependencies: {}, devDependencies: {}}
    //
    if (isRemoteConfig) {
      let remoteConfigFn = await fs.readFile(remoteConfig, 'utf8')
      remoteConfigFn = eval(remoteConfigFn)
      if (
        !!remotePackageJson.dependencies.react &&
        !remotePackageJson.devDependencies['@efox/emp-react'] &&
        !remotePackageJson.dependencies['@efox/emp-react']
      ) {
        withReact(remoteConfigFn)({config, env, empEnv, hot, webpack})
      } else {
        // console.log('======== remoteConfigFn =========')
        remoteConfigFn({config, env, empEnv, hot, webpack})
      }
    } else {
      // 在没有 emp-config.js 的环境下执行
      if (remotePackageJson.dependencies.react) {
        withReact()({config, env, empEnv, hot, webpack})
      }
    }
    // console.log('webpack config', config.toString(), '==========')
    return config.toConfig()
  },
}
