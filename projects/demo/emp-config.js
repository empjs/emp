const {defineConfig} = require('@efox/emp')
const {envLib, lib} = require('./cdn')
module.exports = defineConfig({
  base: '/',
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
  empShare(config) {
    const {mode} = config
    return {
      shareLib: {
        ...envLib[mode],
        ...lib,
      },
    }
  },
  html: {
    favicon: 'public/favicon.ico',
  },
})
