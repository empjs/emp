const {defineConfig} = require('@efox/emp')
// const cdn = require('./cdn')
const CdnModule = require('./cdnModule')
module.exports = defineConfig(config => {
  const {mode, env} = config
  // console.log('[demo emp-config]', config)
  // const cdnModule = new CdnModule(mode)
  // const shareLib = cdnModule.getList(['react', 'react-dom', 'mobx', 'mobx-react-lite', 'react-router-dom'])

  return {
    // base: '/',
    html: {title: 'Demo | EMP v2'},
    server: {
      port: 8000,
      // hot: 'only',
    },
    build: {
      target: 'es2020',
      sourcemap: false,
      // outDir: 'build',
    },
    // jsCheck: true,
    reactRuntime: 'automatic', //增加这个实现无安装依赖热更
    empShare: {
      // shareLib,
    },
    html: {
      favicon: 'public/favicon.ico',
    },
  }
})
