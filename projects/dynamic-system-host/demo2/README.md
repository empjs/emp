# 实例项目  
```javascript 
module.exports = ({config, env}) => {
  const port = 8002
  const projectName = 'demo2'
  const publicPath = `http://localhost:${port}`
  //webpack chain 配置
  //微前端配置
  config.plugin('mf').tap(args => [
    ...args,
    {
      name: projectName,
      library: {type: 'var', name: projectName},
      filename: 'remoteEntry.js',
      remotes: {
        demo1: 'demo1',
      },
      exposes: {
        Hello: './src/components/Hello',
        helper: './src/helper',
      },
      shared: ['react', 'react-dom'],
    },
  ])
  config.output.publicPath(publicPath)
  config.devServer.port(port)
  //
  config.plugin('html').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        title: 'EMP - Project1',
        files: {
          js: ['http://localhost:8001/remoteEntry.js'],
        },
      },
    }
    return args
  })
}

```