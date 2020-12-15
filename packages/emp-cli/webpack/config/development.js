// const RefreshRuntime = require('react-refresh/runtime')
module.exports = (args, config, env) => {
  const {devServer} = require('./devServer')(env, args)
  const devConfig = {
    mode: 'development',
    optimization: {
      usedExports: true,
    },
    // entry: {index: ['react-refresh/runtime', entry]},
    devtool: 'eval',
    devServer,
  }
  config.merge(devConfig)
}
