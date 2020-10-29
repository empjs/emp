module.exports = (args, config, env) => {
  const {devServer} = require('./devServer')(env, args)
  const prodConfig = {
    mode: 'production',
    devtool: 'source-map',
    devServer,
  }
  // return prodConfig
  config.merge(prodConfig)
}
