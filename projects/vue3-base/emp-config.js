const withFrameWork = require('@efox/emp-vue3')
module.exports = withFrameWork(({config}) => {
  const projectName = 'vue3Base'
  config.output.publicPath('http://localhost:8005/')
  config.devServer.port(8005)
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: projectName,
        library: {type: 'var', name: projectName},
        filename: 'emp.js',
        exposes: {
          './Content': './src/components/Content',
          './Button': './src/components/Button',
        },
      },
    }
    return args
  })
  //
  config.plugin('html').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        title: 'EMP Vue3 Base',
        files: {},
      },
    }
    return args
  })
})
