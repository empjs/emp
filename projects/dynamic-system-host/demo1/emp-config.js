const path = require('path')
const packagePath = path.join(path.resolve('./'), 'package.json')
const {dependencies} = require(packagePath)
console.log(packagePath)

module.exports = ({config, env}) => {
  const port = 8001
  const projectName = 'demo1'
  const publicPath = `http://localhost:${port}/`
  const remoteEntry = 'http://localhost:8002/emp.js'
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: projectName,
        library: {type: 'var', name: projectName},
        filename: 'emp.js',
        exposes: {
          './configs/index': 'src/configs/index',
          './components/Demo': 'src/components/Demo',
          './components/Hello': 'src/components/Hello',
        },
        // shared: ['react', 'react-dom'],
        shared: {...dependencies},
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
        files: {
          js: [remoteEntry],
        },
      },
    }
    return args
  })
}
