const withGUIEMP = require('@efox/emp-gui-config')
module.exports = withGUIEMP(({config, env, empEnv}) => {
  const port = 8080
  const url = {
    prod: 'https://emp-react-base.yourdomain.com/',
    test: 'https://emp-react-base-test.yourdomain.com/',
    dev: `http://localhost:${port}/`,
  }
  const publicPath = empEnv ? url[empEnv] : `http://localhost:${port}/`
  // 设置项目URL
  config.output.publicPath(publicPath)
  // 设置项目端口
  config.devServer.port(port)

  // 配置 index.html
  config.plugin('html').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        // head 的 title
        title: 'EMP REACT BASE',
        // 远程调用项目的文件链接
        files: {},
      },
    }
    return args
  })
})
