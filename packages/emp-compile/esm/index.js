// const OptimizePlugin = require('optimize-plugin')
// const BabelEsmPlugin = require('babel-esm-plugin')
//
module.exports = fn => ec => {
  const {config, env, hot} = ec

  config.merge({
    target: ['web', 'es2017'],
    output: {
      module: true,
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
