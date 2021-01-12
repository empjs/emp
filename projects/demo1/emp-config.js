/* function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
} */
module.exports = async ({config, env}) => {
  // await timeout(300) //测试用例 async await
  // console.log('======== withReact config =========')
  config.devServer.port(8001)
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: 'demo1',
        filename: 'emp.js',
        remotes: {
          '@emp/demo2': 'demo2@http://localhost:8002/emp.js',
        },
        exposes: {
          './configs/index': 'src/configs/index',
          './components/Demo': 'src/components/Demo',
          './components/Hello': 'src/components/Hello',
        },
        shared: ['react', 'react-dom'],
      },
    }
    return args
  })
}
