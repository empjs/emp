module.exports = (args, config, env) => {
  // const {devServer} = require('./devServer')(env, args)
  const prodConfig = {
    mode: 'production',
    devtool: 'source-map',
    // devServer,
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  }
  config.merge(prodConfig)
}
