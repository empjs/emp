const withVue2 = require('@efox/emp-vue2')
const withEsbuild = require('@efox/emp-esbuild')
module.exports = withVue2(
  withEsbuild(({config}) => {
    const projectName = 'vue2Base'
    const port = 8009
    config.output.publicPath(`http://localhost:${port}/`)
    config.devServer.port(port)
    config.plugin('mf').tap(args => {
      args[0] = {
        ...args[0],
        ...{
          name: projectName,
          library: {type: 'var', name: projectName},
          filename: 'emp.js',
          exposes: {
            './Content': './src/components/Content',
          },
          // shared: ['vue/dist/vue.esm.js'],
        },
      }
      return args
    })

    config.plugin('html').tap(args => {
      args[0] = {
        ...args[0],
        ...{
          title: 'EMP Vue2 Base',
        },
      }
      return args
    })
  }),
)
