const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
module.exports = (env, config) => {
  const isDev = env === 'development'
  config.optimization.minimize(!isDev)
  console.log('isDev', !isDev)
  config.optimization.minimizer('CssMinimizerPlugin').use(CssMinimizerPlugin, [{cache: true, parallel: true}])
  // If you are using webpack v5 or above you do not need to install terser-webpack-plugin
}
