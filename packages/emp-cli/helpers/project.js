const {checkRemote} = require('./paths')
// const {runtimeLog, defaultRumtime, afterEmpConfigRuntime} = require('./rumtime')
const runtimeCompile = require('./runtime')
const Configs = require('webpack-chain')
const config = new Configs()
const {measure} = require('./debug')

module.exports = {
  async getProjectConfig(env, args = {}, paths) {
    const {
      empConfigPath,
      empPackageJsonPath,
      // isRemoteTsConfig,
    } = await measure('checkRemote', () => checkRemote())

    measure('commonConfig', () => require('../webpack/config/common')(env, config, args, empConfigPath))

    measure(`${env}Config`, () => require(`../webpack/config/${env}`)(args, config, env))

    const cb = await measure(`startCompile`, () =>
      runtimeCompile.startCompile(
        args,
        empPackageJsonPath,
        empConfigPath,
        config,
        env,
        // isRemoteTsConfig,
        paths,
      ),
    )

    return cb
  },
}
