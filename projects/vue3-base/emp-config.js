const withFrameWork = require('@efox/emp-vue3')
module.exports = withFrameWork(({config}) => {
  const projectName = 'vue3Base'
  const port = 8005
  config.output.publicPath(`http://localhost:${port}/`)
  config.devServer.port(port)
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: projectName,
        // library: {type: 'var', name: projectName},
        filename: 'emp.js',
        shared: {
          vue: {eager: true, singleton: true, requiredVersion: '^3.0.2'},
        },
        exposes: {
          './Content': './src/components/Content',
          './Button': './src/components/Button',
          './install': './src/components/install',
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
