module.exports = fn => ec => {
  const { config, env } = ec
  console.log('=== Use SWC Replace Babel ===', env)
  config.module
    .rule('scripts')
    .use('babel')
    .loader(require.resolve('swc-loader'))
    .options({
      sync: true,
      /* env: {
        // coreJs: 3,
        // mode:'usage'
        // mode: "entry"
      }, */
      jsc: {
        target: "es2017",
        loose: true,
        // externalHelpers: true,
        parser: {
          syntax: 'typescript',
          tsx: true,
          dynamicImport: true,
          decorators: true,
        },
        transform: {
          react: {
            runtime: 'automatic'
          }
        }
      },
    })

  if (env === 'production') {
    const TerserPlugin = require("terser-webpack-plugin");
    config.optimization.minimizer('TerserPlugin').tap((args) => {
      args[0] = { ...args[0], ...{ minify: TerserPlugin.swcMinify } }
      console.log('=== Use SWC Terser Minify ===', args[0])
      return args
    })
  }
  // config.module.rule('svg').use('svgr').before('url').loader('@svgr/webpack')

  return fn && fn(ec)
}
