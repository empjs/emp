const {defineConfig} = require('@efox/emp')
const cdn = require('./cdn')

module.exports = defineConfig(({mode}) => {
  return {
    server: {
      port: 8001,
    },
    empShare: {
      name: 'microHost',
      // esm 共享需要设置 window
      // library: {name: 'microHost', type: 'window'},
      exposes: {
        './App': './src/App',
      },
      // shared: {
      //   react: {requiredVersion: '^17.0.1'},
      //   'react-dom': {requiredVersion: '^17.0.1'},
      // },
      shareLib: cdn(mode),
    },
    html: {title: 'Micro-Host'},
  }
})
