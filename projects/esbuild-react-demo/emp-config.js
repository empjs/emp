const withESbuild = require('@efox/emp-esbuild')
module.exports = withESbuild(({config}) => {
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: 'esbuildReactDemo',
        filename: 'emp.js',
        remotes: {
          '@emp/demo1': 'demo1@http://localhost:8001/emp.js',
        },
        exposes: {},
        shared: {
          react: {eager: true, singleton: true, requiredVersion: '^16.13.1'},
          'react-dom': {eager: true, singleton: true, requiredVersion: '^16.13.1'},
          'react-router-dom': {requiredVersion: '^5.1.2'},
          axios: {requiredVersion: '^0.19.2'},
        },
      },
    }
    return args
  })
})
