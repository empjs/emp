const withVue2 = require('@efox/emp-vue2')
module.exports = withVue2(({config}) => {
  const projectName = 'vue2Project'
  const port = 8008
  config.output.publicPath(`http://localhost:${port}/`)
  config.devServer.port(port)
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: projectName,
        library: {type: 'var', name: projectName},
        filename: 'emp.js',
        shared: ['vue/dist/vue.esm.js'],
        remotes: {
          '@v2b': 'vue2Base',
        },
      },
    }
    return args
  })

  config.plugin('html').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        title: 'EMP Vue2 Project',
        files: {
          js: ['http://localhost:8009/emp.js'],
        },
      },
    }
    return args
  })
})
