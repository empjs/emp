const withVue3 = require('@efox/emp-vue3')
module.exports = withVue3(({config}) => {
  const projectName = 'elementPlusBase'
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
        exposes: {
          './HelloWorld': './src/components/HelloWorld',
          './element-plus/ElementPlus': 'element-plus/lib/index.esm',
          './element-plus/themeChalk': 'element-plus/lib/theme-chalk/index.css',
        },
        shared: {
          vue: {eager: true, singleton: true, requiredVersion: '^3.0.2'},
          'element-plus': {eager: true, singleton: true, requiredVersion: '^1.0.1-beta.0'},
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
        title: 'Element Plus Base',
        files: {},
      },
    }
    return args
  })
})
