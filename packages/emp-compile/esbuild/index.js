module.exports = fn => ec => {
  const {config,env} = ec
  console.log('=== Use ESBUILD Replace Babel ===', env)
  config.module
    .rule('scripts')
    .use('babel')
    .loader(require.resolve('esbuild-loader'))
    .options({
      target: 'esnext',
      loader: 'tsx',
      // color: true,
    })

  config.module
    .rule('svg')
    .use('svgr')
    .before('url')
    .loader(require.resolve('@svgr/webpack'))
    .options({babel: false})
    .end()
    .use('babel')
    .before('svgr')
    .loader(require.resolve('esbuild-loader'))
    .options({
      target: 'esnext',
      loader: 'tsx',
    })

  if (env === 'production') {
    const TerserPlugin = require("terser-webpack-plugin");
    config.optimization.minimizer('TerserPlugin').tap((args) => {
      args[0] = { ...args[0], ...{ minify: TerserPlugin.esbuildMinify } }
      args[0].terserOptions={
          minify: true,
          // minifyWhitespace: true,
          // minifyIdentifiers: true,
          // minifySyntax: true,
          legalComments:'none'
      }
      console.log('=== Use ESBUILD Terser Minify ===', args[0])
      return args
    })
  }

  return fn && fn(ec)
}
