const path = require('path')
const packagePath = path.join(path.resolve('./'), 'package.json')
const {dependencies} = require(packagePath)

module.exports = ({config, env, empEnv}) => {
  console.log('empEnv===> 部署环境变量 serve模式不需要该变量', empEnv, env)
  const port = 8002
  const projectName = 'demo2'
  const publicPath = `http://localhost:${port}/`
  const remoteEntry = 'http://localhost:8001/emp.js'
  //
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: projectName,
        library: {type: 'var', name: projectName},
        filename: 'emp.js',
        remotes: {
          '@emp/demo1': 'demo1',
        },
        exposes: {
          './components/Hello': 'src/components/Hello',
          './helper': 'src/helper',
        },
        // shared: ['react', 'react-dom'],
        shared: {
          ...dependencies,
        },
      },
    }
    return args
  })
  config.output.publicPath(publicPath)
  config.devServer.port(port)
  config.plugin('html').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        title: 'EMP - Project1',
        files: {
          js: [remoteEntry],
        },
      },
    }
    return args
  })
}
