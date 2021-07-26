const TerserPlugin = require('terser-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {getPaths} = require('../../helpers/paths')
const paths = getPaths()

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
    plugin: {
      clean: {plugin: CleanWebpackPlugin, args: []},
      copy: {
        plugin: CopyWebpackPlugin,
        args: [
          {
            patterns: [
              {
                from: paths.public.replace(/\\/g, '/'),
                to: paths.dist.replace(/\\/g, '/'),
                globOptions: {
                  // 加入 paths.template 避免被重置
                  ignore: ['*.DS_Store', paths.template.replace(/\\/g, '/'), paths.favicon.replace(/\\/g, '/')],
                },
                noErrorOnMissing: true,
              },
            ],
          },
        ],
      },
    },
  }
  config.merge(prodConfig)
  if (args.minify === true) {
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
}
