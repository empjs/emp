const withVue2 = require('@efox/emp-vue2')
const path = require('path')
const ProjectRootPath = path.resolve('./')
// const packagePath = path.join(ProjectRootPath, 'package.json')
// const {dependencies} = require(packagePath)
const {getConfig} = require(path.join(ProjectRootPath, './src/config'))
module.exports = withVue2(({config, env, empEnv}) => {
  const confEnv = env === 'production' ? 'prod' : 'dev'
  const conf = getConfig(empEnv || confEnv)
  console.log('config', conf)
  const port = conf.port
  const projectName = 'vue2Components'
  const publicPath = conf.publicPath
  config.output.publicPath(publicPath)
  config.devServer.port(port)
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: projectName,
        library: {type: 'var', name: projectName},
        filename: 'emp.js',
        remotes: {
          vue2Components: 'vue2Components',
        },
        exposes: {
          './Content.vue': './src/components/Content',
        },
        shared: ['vue/dist/vue.esm.js'],
        // shared: {
        //   ...dependencies,
        // },
      },
    }
    return args
  })

  config.plugin('html').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        title: 'EMP Vue2 Components',
        files: {
          // js: ['http://localhost:8005/emp.js'],
        },
      },
    }
    return args
  })
})
