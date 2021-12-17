const {defineConfig} = require('@efox/emp')

module.exports = defineConfig(() => {
  return {
    server: {
      port: 8881,
    },
    empShare: {
      name: 'mfHost',
      exposes: {
        './App': './src/App',
      },
      shared: {
        react: {requiredVersion: '^17.0.1'},
        'react-dom': {requiredVersion: '^17.0.1'},
      },
    },
  }
})
