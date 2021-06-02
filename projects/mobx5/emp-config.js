/**
 * @type {import('@efox/emp-cli').EMPConfig}
 */
module.exports = {
  webpack({webpackEnv}) {
    return {
      devServer: {
        port: 8005,
      },
    }
  },
  async moduleFederation({webpackEnv}) {
    return {
      name: 'mobx5',
      filename: 'emp.js',
      remotes: {
        mobx6: 'mobx6@http://127.0.0.1:8006/emp.js',
      },
      exposes: {
        './Demo': 'src/Demo',
        './Hello': 'src/Hello',
      },
      shared: {
        react: {eager: true, singleton: true, requiredVersion: '^17.0.1'},
        'react-dom': {eager: true, singleton: true, requiredVersion: '^17.0.1'},
      },
    }
  },
}
