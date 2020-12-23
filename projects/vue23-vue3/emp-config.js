const withFrameWork = require('@efox/emp-vue3')
module.exports = withFrameWork(({config}) => {
  const projectName = 'vue3Project'
  config.devServer.port(8006)
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: projectName,
        filename: 'emp.js',
        remotes: {
          '@v2b': 'vue2Base@http://localhost:8009/emp.js',
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
        files: {},
      },
    }
    return args
  })
})
