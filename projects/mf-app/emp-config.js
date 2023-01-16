const {defineConfig} = require('@efox/emp')
const compile = require('@efox/emp-compile-swc')
module.exports = defineConfig(() => {
  return {
    compile,
    css: {
      minType: 'swc',
    },
    server: {
      port: 8882,
    },
    empShare: {
      name: 'mfApp',
      remotes: {
        '@mfHost': `mfHost@http://127.0.0.1:8881/emp.js`,
      },
      exposes: {
        './App': './src/App',
      },
      shared: {
        react: {requiredVersion: '^17.0.1', singleton: true},
        'react-dom': {requiredVersion: '^17.0.1', singleton: true},
      },
    },
  }
})
