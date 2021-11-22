const {defineConfig} = require('@efox/emp')
const {envLib, lib} = require('./cdn')
module.exports = defineConfig(config => {
  const {mode, env} = config
  console.log('[demo emp-config]', config)
  return {
    // base: '/',
    html: {title: 'Demo | EMP v2'},
    server: {
      port: 8000,
      // hot: 'only',
    },
    build: {
      target: 'es5',
      sourcemap: false,
      // outDir: 'build',
    },
    // jsCheck: true,
    reactRuntime: 'automatic', //增加这个实现无安装依赖热更
    empShare: {
      shareLib: {
        ...envLib[mode],
        ...lib,
      },
    },
    html: {
      favicon: 'public/favicon.ico',
      // publicPath: '/',域名配置可以设置这里
    },
  }
})
