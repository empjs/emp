const {defineConfig} = require('@efox/emp')
const compile = require('@efox/emp-compile-swc')
const deps = require('./package.json').dependencies
module.exports = defineConfig(() => {
  return {
    compile,
    // css: {
    //   minType: 'swc',
    // },
    server: {
      port: 8882,
    },
    empShare: {
      name: 'mfApp',
      remotes: {
        '@mfHost': `mfHost@http://localhost:8881/emp.js`,
      },
      exposes: {
        './App': './src/App',
      },
      shared: {
        react: {
          requiredVersion: deps.react,
          singleton: true,
          // eager: true,
        },
        'react-dom': {
          requiredVersion: deps['react-dom'],
          singleton: true,
          // eager: true,
        },
        mobx: deps.mobx,
        'mobx-react': deps['mobx-react'],
      },
    },
    debug: {
      clearLog: false,
      // level: 'debug',
      webpackCache: false,
    },
  }
})
