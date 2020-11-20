const withVue3 = require('@efox/emp-vue3')
module.exports = withVue3(({config}) => {
  const projectName = 'elementPlus'
  const port = 8811
  config.output.publicPath(`http://localhost:${8811}/`)
  config.devServer.port(port)
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: projectName,
        library: {type: 'var', name: projectName},
        filename: 'emp.js',
        /* shared: {
          vue: {eager: true, singleton: true, requiredVersion: '^3.0.2'},
        }, */
      },
    }
    return args
  })
  //
  config.plugin('html').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        title: 'Element Plus',
        files: {},
      },
    }
    return args
  })
})
