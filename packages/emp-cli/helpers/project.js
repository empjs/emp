// const {runtimeLog, defaultRumtime, afterEmpConfigRuntime} = require('./rumtime')
const empRuntime = require('./runtime')
const Configs = require('webpack-chain')
const config = new Configs()
const {measure} = require('./logger')

module.exports = {
  async getProjectConfig(env, args = {}, paths) {
    await empRuntime.setup(args, config, env, paths)
    measure('commonConfig', () => require('../webpack/config/common')())
    measure(`${env}Config`, () => require(`../webpack/config/${env}`)(args, config, env))
    //
    const cb = await measure(`startCompile`, () => empRuntime.startCompile())

    return cb
  },
}
