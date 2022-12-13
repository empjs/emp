const {defineConfig} = require('@efox/emp')

module.exports = defineConfig(() => {
  return {
    server: {
      // port: 8881,
    },
    empShare: {
      name: 'mfHost',
      exposes: {
        './App': './src/App',
        './incStore': './src/store/incStore',
        './css': './src/Button/Button.module.css',
      },
      shared: {
        react: {requiredVersion: '^17.0.1', singleton: true},
        'react-dom': {requiredVersion: '^17.0.1', singleton: true},
      },
    },
    createTs: true,
  }
})
