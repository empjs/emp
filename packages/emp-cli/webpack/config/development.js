// const RefreshRuntime = require('react-refresh/runtime')
module.exports = (args, config, env) => {
  const {devServer} = require('./devServer')(env, args)
  const devConfig = {
    mode: 'development',
    /* optimization: {
      usedExports: true,
    }, */
    devtool: 'inline-source-map',
    // devtool: 'eval-cheap-module-source-map',
    devServer,
  }
  config.merge(devConfig)
}
