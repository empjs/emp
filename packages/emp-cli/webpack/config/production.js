const TerserPlugin = require('terser-webpack-plugin')
module.exports = (args, config, env) => {
  // const {devServer} = require('./devServer')(env, args)
  const prodConfig = {
    mode: 'production',
    // devtool: 'source-map',
    devtool: false,
    // devServer,
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  }
  config.merge(prodConfig)
  config.optimization.minimizer('TerserPlugin').use(TerserPlugin, [
    {
      extractComments: false,
      terserOptions: {
        // mangle: false, 保留ts class name
        compress: {
          passes: 2,
        },
      },
    },
  ])
}
