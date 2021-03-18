const {checkRemote} = require('./paths')
const {runtimeLog, defaultRumtime, afterEmpConfigRuntime} = require('./rumtime')
const Configs = require('webpack-chain')
const config = new Configs()

module.exports = {
  async getProjectConfig(env, args = {}) {
    const {empConfigPath, empPackageJsonPath, isRemoteTsConfig} = await checkRemote()
    require('../webpack/config/common')(env, config, args, empConfigPath)
    require(`../webpack/config/${env}`)(args, config, env)
    await defaultRumtime(args, empPackageJsonPath, empConfigPath, config, env, isRemoteTsConfig)
    afterEmpConfigRuntime(config, env)
    const wpc = config.toConfig()
    await runtimeLog(args, wpc, config)
    return wpc
  },
}
