const {defineConfig} = require('@efox/emp')

module.exports = defineConfig({
  server: {
    port: 8001,
  },
  moduleFederation: {
    name: 'microHost',
    library: {name: 'microHost', type: 'var'},
    exposes: {
      './App': './src/App',
    },
    shared: {
      react: {requiredVersion: '^17.0.1'},
      'react-dom': {requiredVersion: '^17.0.1'},
    },
  },
})
