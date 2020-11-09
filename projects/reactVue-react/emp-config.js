const path = require('path')
const packagePath = path.join(path.resolve('./'), 'package.json')
const {dependencies} = require(packagePath)
console.log(packagePath)

module.exports = ({config, env}) => {
  const port = 8001
  const projectName = 'ReactComponents'
  const publicPath = `http://localhost:${port}/`
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        // 项目名称
        name: projectName,
        // 暴露项目的全局变量名
        library: {type: 'var', name: projectName},
        // 被远程引入的文件名
        filename: 'emp.js',
        // 远程项目别名:远程引入的项目名
        remotes: {
          '@emp/vueComponents': 'vueComponents',
        },
        // 需要暴露的东西
        exposes: {
          // 别名:组件的路径
          './configs/index': 'src/configs/index',
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
          js: ['http://localhost:8006/emp.js'],
        },
      },
    }
    return args
  })
}
