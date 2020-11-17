const withCocos2d = require('@efox/emp-cocos2d')
const ip = require('ip')

module.exports = withCocos2d(
  ({config, env, empEnv}) => {
    const port = 9001
    // const projectName = 'empCocos2dDemo'
    const host = ip.address()
    const publicPath = `http://${host}:${port}/`

    config.plugin('mf').tap(args => {
      args[0] = {
        ...args[0],
        ...{
          // name: projectName,
          // library: {type: 'var', name: projectName},
          // filename: 'emp.js',
          remotes: {
            '@empcocos2d/base': 'empCocos2dDemo',
          },
        },
      }
      return args
    })
    config.output.publicPath(publicPath)
    config.devServer.host(host)
    config.devServer.port(port)
  },
  {
    // creator开启的服务端口
    creatorPort: 7457,
    // 引用基站资源链接
    empJs: [`http://${ip.address()}:9000/emp.js`],
  },
)
