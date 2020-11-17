const withPreact = require('@efox/emp-preact')
const path = require('path')
const ProjectRootPath = path.resolve('./')
const {getConfig} = require(path.join(ProjectRootPath, './src/config'))

module.exports = withPreact(({config, env, empEnv}) => {
  const confEnv = env === 'production' ? 'prod' : 'dev'
  const conf = getConfig(empEnv || confEnv)

  const host = conf.host
  const port = conf.port
  const projectName = 'preactProject'
  const publicPath = conf.publicPath

  config.plugin('html').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        title: 'EMP PREACT BASE',
        files: {
          js: ['http://localhost:8006/emp.js'],
        },
      },
    }
    return args
  })

  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: projectName,
        library: {type: 'var', name: projectName},
        filename: 'emp.js',
        remotes: {
          '@emp-preact/base': 'preactComponents',
        },
      },
    }
    return args
  })
  config.output.publicPath(publicPath)
  config.devServer.port(port)
})
