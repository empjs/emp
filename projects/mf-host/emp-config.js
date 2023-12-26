const {defineConfig} = require('@efox/emp')
const compile = require('@efox/emp-compile-swc')
const deps = require('./package.json').dependencies
module.exports = defineConfig(() => {
  return {
    compile,
    server: {
      port: 8881,
    },
    // css: {
    //   minType: 'swc',
    // },
    empShare: {
      name: 'mfHost',
      exposes: {
        './App': './src/App',
        './store': './src/store',
        './css': './src/Button/Button.module.css',
        // './react17': require.resolve('react'),
        // './reactDOM17': require.resolve('react-dom'),
      },
      shared: {
        react: {
          // shareKey: 'react17',
          requiredVersion: deps.react,
          singleton: true,
          // eager: true,
        },
        'react-dom': {
          // shareKey: 'reactDOM17',
          requiredVersion: deps['react-dom'],
          singleton: true,
          // eager: true,
        },
        mobx: deps.mobx,
        'mobx-react': deps['mobx-react'],
      },
    },
    createTs: true,
  }
})
