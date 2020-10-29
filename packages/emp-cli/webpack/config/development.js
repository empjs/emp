// const RefreshRuntime = require('react-refresh/runtime')
module.exports = (args, config, env) => {
  const {devServer} = require('./devServer')(env, args)
  const devConfig = {
    mode: 'development',
    optimization: {
      usedExports: true,
    },
    // entry: {index: ['react-refresh/runtime', entry]},
    devtool: 'inline-source-map',
    devServer,
  }
  // const conf = merge.smart(commonWebpackConfig, devConfig)
  // console.log('dev conf', conf.module.rules, commonWebpackConfig.module.rules)
  // return devConfig
  config.merge(devConfig)
}
