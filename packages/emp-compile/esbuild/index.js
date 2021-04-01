// const path = require('path')
const {ESBuildMinifyPlugin} = require('esbuild-loader')
module.exports = fn => ec => {
  const {config} = ec
  config.module
    .rule('scripts')
    .use('babel')
    // .use('esbuild')
    // .before('babel')
    .loader('esbuild-loader')
    .options({
      target: 'esnext',
      loader: 'tsx',
      // color: true,
    })
  /* .end()
    .use('babel')
    .loader('babel-loader')
    .options({
      presets: [
        [
          '@babel/preset-env',
          {
            useBuiltIns: 'entry',
            // debug: isDev,
            debug: false,
            corejs: 3,
            bugfixes: true,
            exclude: ['transform-typeof-symbol'],
          },
        ],
        '@babel/preset-typescript',
        '@babel/preset-react',
      ],
      plugins: [
        ['import', {libraryName: 'antd', style: true}],
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: false,
            helpers: true,
            version: require('@babel/runtime/package.json').version,
            regenerator: true,
            useESModules: false,
            absoluteRuntime: false,
          },
        ],
        ['@babel/plugin-proposal-decorators', {legacy: true}],
        ['@babel/plugin-proposal-class-properties', {loose: true}],
      ],
    }) */

  config.module
    .rule('svg')
    .use('svgr')
    .before('url')
    .loader('@svgr/webpack')
    .options({babel: false})
    .end()
    .use('babel')
    .before('svgr')
    .loader('esbuild-loader')
    .options({
      target: 'esnext',
      loader: 'tsx',
    })

  // config.plugin('esbuild-plugin').use(ESBuildPlugin)
  // config.plugins.delete('reacthotloader')
  config.optimization.minimizer('esbuild-mini').use(ESBuildMinifyPlugin, [
    // {target: 'es5'}
  ])

  return fn && fn(ec)
}
