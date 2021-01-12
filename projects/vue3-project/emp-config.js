const withFrameWork = require('@efox/emp-vue3')
//
/* function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
} */
//
module.exports = withFrameWork(async ({config}) => {
  // await timeout(500) //测试用例 async await 外置插件
  // console.log('======== with vue config end delay =========')
  const projectName = 'vue3Project'
  const port = 8006
  // config.output.publicPath(`http://localhost:${port}/`)
  config.devServer.port(port)
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: projectName,
        filename: 'emp.js',
        remotes: {
          '@v3b': 'vue3Base@http://localhost:8005/emp.js',
        },
        exposes: {},
        shared: {
          vue: {eager: true, singleton: true, requiredVersion: '^3.0.2'},
        },
      },
    }
    return args
  })
  config.plugin('html').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        title: 'EMP Vue3 Project',
        files: {
          js: [
            // 'http://localhost:8005/emp.js',
            //'http://localhost:8009/emp.js'
          ],
        },
      },
    }
    return args
  })
})
