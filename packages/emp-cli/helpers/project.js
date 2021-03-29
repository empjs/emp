const {checkRemote} = require('./paths')
// const {runtimeLog, defaultRumtime, afterEmpConfigRuntime} = require('./rumtime')
const runtimeCompile = require('./runtime')
const Configs = require('webpack-chain')
const config = new Configs()

module.exports = {
  async getProjectConfig(env, args = {}) {
    const {empConfigPath, empPackageJsonPath, isRemoteTsConfig} = await checkRemote()
    require('../webpack/config/common')(env, config, args, empConfigPath)
    require(`../webpack/config/${env}`)(args, config, env)
    const wpc = await runtimeCompile.startCompile(
      args,
      empPackageJsonPath,
      empConfigPath,
      config,
      env,
      isRemoteTsConfig,
    )
    return wpc
  },
}
