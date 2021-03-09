const fs = require('fs-extra')
const {resolveApp, appPackageJson, checkRemote} = require('./paths')
const {runtimeLog, defaultRumtime} = require('./rumtime')
const Configs = require('webpack-chain')
const config = new Configs()
const webpack = require('webpack')
const withReact = require('@efox/emp-react')
module.exports = {
  async getProjectConfig(env, args = {}) {
    const {empConfigPath, empPackageJsonPath, isRemoteTsConfig} = await checkRemote()
    require('../webpack/config/common')(env, config, args, empConfigPath)
    require(`../webpack/config/${env}`)(args, config, env)
    await defaultRumtime(args, empPackageJsonPath, empConfigPath, config, env, isRemoteTsConfig)
    const wpc = config.toConfig()
    await runtimeLog(args, wpc, config)
    return wpc
  },
}
