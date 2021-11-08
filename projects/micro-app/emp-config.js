const {defineConfig} = require('@efox/emp')

module.exports = defineConfig({
  server: {
    port: 8002,
  },
  moduleFederation: {
    name: 'microApp',
    remotes: {
      '@microHost': 'microHost@http://localhost:8001/emp.js',
    },
    exposes: {
      './App': './src/App',
    },
    shared: {
      react: {requiredVersion: '^17.0.1'},
      'react-dom': {requiredVersion: '^17.0.1'},
    },
  },
})
