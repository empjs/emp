// const OptimizePlugin = require('optimize-plugin')
// const BabelEsmPlugin = require('babel-esm-plugin')
//
module.exports = fn => ec => {
  const {config, env, hot} = ec

  config.merge({
    devtool: false,
    target: ['web', 'es2017'],
    externalsPresets: {
      web: false,
      webAsync: true,
    },
    output: {
      module: true,
      scriptType: 'module', // script type=module
      crossOriginLoading: 'anonymous', // 允许跨域
      publicPath: '/',
      environment: {
        arrowFunction: true,
        bigIntLiteral: true,
        const: true,
        destructuring: true,
        forOf: true,
        dynamicImport: true,
        module: true,
      },
    },
    experiments: {
      outputModule: true,
      topLevelAwait: true,
      asyncWebAssembly: true,
      syncWebAssembly: true,
    },
    /* plugin: {
      OptimizePlugin: {
        plugin: OptimizePlugin,
        args: [{}],
      },
      BabelEsmPlugin: {
        plugin: BabelEsmPlugin,
        args: [{}],
      },
    }, */
  })
  return fn && fn(ec)
}
