const withSvetle = require('@efox/emp-svetle')
const path = require('path')
const ProjectRootPath = path.resolve('./')
// const packagePath = path.join(ProjectRootPath, 'package.json')
// const {dependencies} = require(packagePath)
const {getConfig} = require(path.join(ProjectRootPath, './src/config'))
module.exports = withSvetle(({config, env, empEnv}) => {
  const confEnv = env === 'production' ? 'prod' : 'dev'
  const conf = getConfig(empEnv || confEnv)
  const port = conf.port
  const projectName = 'svetleComponents'
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
          svetleComponents: 'svetleComponents',
        },
        exposes: {
          './App': './src/main.js',
          './loadApp': './src/loadApp.js',
        },
        shared: [],
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
        title: 'EMP svetle Components',
        files: {
          // js: ['http://localhost:8005/emp.js'],
        },
      },
    }
    return args
  })
})
