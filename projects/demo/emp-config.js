const {defineConfig} = require('@efox/emp')
const cdn = require('./cdn')
module.exports = defineConfig(config => {
  const {mode, env} = config
  // console.log('[demo emp-config]', config)
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
      shareLib: cdn(mode),
    },
    html: {
      favicon: 'public/favicon.ico',
    },
  }
})
