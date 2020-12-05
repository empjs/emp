const withSWC = require('@efox/emp-swc')
module.exports = withSWC(({config}) => {
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
        shared: ['axios', 'react', 'react-dom', 'react-router-dom'],
      },
    }
    return args
  })
  config.plugin('dayReplaceToMoment').use(require('antd-dayjs-webpack-plugin'))
})
