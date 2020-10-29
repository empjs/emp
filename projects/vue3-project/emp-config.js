const path = require('path')
const {VueLoaderPlugin} = require('vue-loader')
//
const ProjectRootPath = path.resolve('./')
// const packagePath = path.join(ProjectRootPath, 'package.json')
// const {dependencies} = require(packagePath)
//
const {getConfig} = require(path.join(ProjectRootPath, './src/config'))
//
module.exports = ({config, env, empEnv}) => {
  const confEnv = env === 'production' ? 'prod' : 'dev'
  const conf = getConfig(empEnv || confEnv)
  console.log('config', conf)
  //
  const srcPath = path.resolve('./src')
  config.entry('index').clear().add(path.join(srcPath, 'main.js'))
  //
  config.resolve.alias.set('vue', '@vue/runtime-dom')
  config.plugin('vue3').use(VueLoaderPlugin, [])
  config.module
    .rule('vue')
    .test(/\.vue$/)
    .use('vue-loader')
    .loader('vue-loader')
  //
  const host = conf.host
  const port = conf.port
  const projectName = 'vue3Components'
  const publicPath = conf.publicPath
  config.output.publicPath(publicPath)
  config.devServer.port(port)
  //
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: projectName,
        library: {type: 'var', name: projectName},
        filename: 'emp.js',
        /* remotes: {
          vue3Components: 'vue3Components',
        }, */
        exposes: {
          './Content': './src/components/Content',
          './Button': './src/components/Button',
        },
        /* shared: {
          ...dependencies,
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
        title: 'EMP Vue3 Components',
        files: {
          // js: ['http://localhost:8005/emp.js'],
        },
      },
    }
    return args
  })
}
