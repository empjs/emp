/**
 * @type {import('@efox/emp-cli').EMPConfig}
 */
module.exports = {
  webpack({webpackEnv}) {
    return {
      devServer: {
        port: 8006,
      },
    }
  },
  async moduleFederation({webpackEnv}) {
    return {
      name: 'mobx6',
      filename: 'emp.js',
      remotes: {
        mobx5: 'mobx5@http://127.0.0.1:8005/emp.js',
      },
      exposes: {
        './Demo': 'src/Demo',
      },
      shared: {
        react: {eager: true, singleton: true, requiredVersion: '^17.0.1'},
        'react-dom': {eager: true, singleton: true, requiredVersion: '^17.0.1'},
      },
    }
  },
}
