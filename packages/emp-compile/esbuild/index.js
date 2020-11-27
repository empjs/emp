// const path = require('path')
const {ESBuildPlugin, ESBuildMinifyPlugin} = require('esbuild-loader')
module.exports = fn => ec => {
  const {config, env, hot} = ec
  const isDev = env === 'development'
  config.module
    .rule('scripts')
    .use('babel')
    .loader('esbuild-loader')
    .options({
      target: 'esnext',
      loader: 'tsx',
      plugin: ['babel-plugin-named-asset-import'],
    })
  config.plugin('esbuild-plugin').use(ESBuildPlugin)
  config.optimization.minimizer('esbuild-mini').use(ESBuildMinifyPlugin)
  if (hot && isDev) {
    config.plugin('reacthotloader').use(require('@pmmmwh/react-refresh-webpack-plugin'))
  }

  return fn && fn(ec)
}
