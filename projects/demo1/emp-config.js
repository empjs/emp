const mf = require('./empconfig/mf')

/**
 * @type {import('@efox/emp-cli').EMPConfig}
 */
module.exports = {
  webpack({webpackEnv}) {
    console.log('webpack', webpackEnv)
    return {
      devServer: {
        port: 8001,
      },
    }
  },
  moduleGenerator({webpackEnv}) {
    console.log('moduleGenerator', webpackEnv)
    return webpackEnv === 'development' ? '/' : `http://localhost:8001/`
  },
  async moduleFederation({webpackEnv}) {
    return mf(webpackEnv)
  },
}
