const withFrameWork = require('@efox/emp-vue3')
module.exports = withFrameWork(({config}) => {
  const projectName = 'vue3Project'
  config.output.publicPath('http://localhost:8006/')
  config.devServer.port(8006)
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: projectName,
        library: {type: 'var', name: projectName},
        filename: 'emp.js',
        remotes: {
          '@v3b': 'vue3Base',
          '@v2b': 'vue2Base',
        },
        exposes: {},
        /* shared: {
          vue: {eager: true, singleton: true, requiredVersion: '^3.0.2'},
        }, */
      },
    }
    return args
  })
  config.plugin('html').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        title: 'EMP Vue3 Project',
        files: {
          js: ['http://localhost:8005/emp.js', 'http://localhost:8009/emp.js'],
        },
      },
    }
    return args
  })
})
