const withSWC = require('@efox/emp-swc')
const env = require('./dev')
const pkg = require('./package.json')
/**
 * @type {import('@efox/emp-cli').EMPConfig}
 */
module.exports = {
  compile: [withSWC],
  moduleFederation: {
    name: 'swcReactDemo',
    filename: 'emp.js',
    remotes: {
      '@emp/demo1': 'demo1@http://localhost:8001/emp.js',
    },
    exposes: {},
    // shared: ['axios', 'react', 'react-dom', 'react-router-dom'],
    /* shared: {
      react: {requiredVersion: pkg.dependencies.react},
      'react-dom': {requiredVersion: pkg.dependencies['react-dom']},
      'react-router-dom': {requiredVersion: pkg.dependencies['react-router-dom']},
      axios: {requiredVersion: pkg.dependencies.axios},
    }, */
    shared: {
      'react-router-dom': {requiredVersion: pkg.dependencies['react-router-dom']},
      axios: {requiredVersion: pkg.dependencies.axios},
      react: {
        eager: true,
        singleton: true,
        requiredVersion: pkg.dependencies.react,
      },
      'react-dom': {
        eager: true,
        singleton: true,
        requiredVersion: pkg.dependencies['react-dom'],
      },
    },
  },
  webpackChain(config, {env}) {
    config.plugin('dayReplaceToMoment').use(require('antd-dayjs-webpack-plugin'))
    if (env === 'production') {
      config.optimization.minimizer('TerserPlugin').tap(args => {
        args[0].terserOptions.mangle = false
        return args
      })
    }
  },
}
/* console.log(env)
module.exports = withSWC(({config, env}) => {
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: 'swcReactDemo',
        filename: 'emp.js',
        remotes: {
          '@emp/demo1': 'demo1@http://localhost:8001/emp.js',
        },
        exposes: {},
        // shared: ['axios', 'react', 'react-dom', 'react-router-dom'],
      },
    }
    return args
  })
  config.plugin('dayReplaceToMoment').use(require('antd-dayjs-webpack-plugin'))
  // 保留原来类名
  if (env === 'production') {
    config.optimization.minimizer('TerserPlugin').tap(args => {
      args[0].terserOptions.mangle = false
      return args
    })
  }
  //
  // config.output.publicPath('/')
  // config.devServer.host('0.0.0.0')
})
 */
