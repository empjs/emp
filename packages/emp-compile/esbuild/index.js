// const path = require('path')
const {ESBuildPlugin, ESBuildMinifyPlugin} = require('esbuild-loader')
module.exports = fn => ec => {
  const {config} = ec
  config.module.rule('scripts').use('babel').loader('esbuild-loader').options({
    target: 'esnext',
    loader: 'tsx',
    // color: true,
  })
  config.module.rule('svg').use('svgr').before('url').loader('@svgr/webpack')

  config.plugin('esbuild-plugin').use(ESBuildPlugin)
  config.optimization.minimizer('esbuild-mini').use(ESBuildMinifyPlugin)

  return fn && fn(ec)
}
