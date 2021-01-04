const withFrameWork = require('@efox/emp-vue3')
module.exports = withFrameWork(({config}) => {
  const projectName = 'elementPlusProject'
  const port = 8812
  config.output.publicPath(`http://localhost:${port}/`)
  config.devServer.port(port)
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: projectName,
        library: {type: 'var', name: projectName},
        filename: 'emp.js',
        remotes: {
          '@v3p': 'elementPlusBase',
        },
        exposes: {},
        shared: {
          vue: {eager: true, singleton: true, requiredVersion: '^3.0.2'},
          'element-plus': {eager: true, singleton: true, requiredVersion: '^1.0.1-beta.0'},
        },
      },
    }
    return args
  })
  config.plugin('html').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        title: 'Element Plus Project',
        files: {
          js: ['http://localhost:8811/emp.js'],
        },
      },
    }
    return args
  })
})
