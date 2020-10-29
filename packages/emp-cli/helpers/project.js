const fs = require('fs-extra')
const {resolveApp} = require('../helpers/paths')
const Configs = require('webpack-chain')
const config = new Configs()
const webpack = require('webpack')
module.exports = {
  async getProjectConfig(env, args) {
    args = args || {}
    require('../webpack/config/common')(env, config, args)
    require(`../webpack/config/${env}`)(args, config, env)
    let remoteConfig = resolveApp('emp-config.js')
    const isRemoteConfig = await fs.exists(remoteConfig)
    if (isRemoteConfig) {
      remoteConfig = await fs.readFile(remoteConfig, 'utf8')
      remoteConfig = eval(remoteConfig)
      //
      const empEnv = args.empEnv
      remoteConfig({config, env, empEnv, webpack})
    }
    // console.log('webpack config', config.toString(), '==========')
    return config.toConfig()
  },
}
