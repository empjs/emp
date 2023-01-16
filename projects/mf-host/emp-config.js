const {defineConfig} = require('@efox/emp')
const compile = require('@efox/emp-compile-swc')
module.exports = defineConfig(() => {
  return {
    compile,
    server: {
      port: 8881,
    },
    css: {
      minType: 'swc',
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
