const withBoundary = require('@efox/emp-react-error-boundary')
const path = require('path')
const packagePath = path.join(path.resolve('./'), 'package.json')
const {dependencies} = require(packagePath)
console.log('withBoundary:', withBoundary)
module.exports = withBoundary(({config, env}) => {
  const port = 8001
  const projectName = 'empReactBase'
  const publicPath = `http://localhost:${port}/`
  // 设置项目URL
  config.output.publicPath(publicPath)
  // 设置项目端口
  config.devServer.port(port)
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      name: 'empReactBase',
      remotes: {
        '@emp/react-project': 'empReactProject@http://localhost:8002/emp.js',
      },
      exposes: {
        // './configs/index': 'src/configs/index',
        // './components/Demo': 'src/components/Demo',
        // './components/Hello': 'src/components/Hello',
      },
      shared: {},
      // 被远程引入的文件名
      filename: 'emp.js',
    }
    return args
  })
  // 配置 index.html
  config.plugin('html').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        // head 的 title
        title: 'EMP-Base-Project',
        // 远程调用项目的文件链接
        files: {},
      },
    }
    return args
  })
})
