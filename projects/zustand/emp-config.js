const {defineConfig} = require('@efox/emp')
module.exports = defineConfig(() => {
  return {
    server: {
      port: 2001,
      https: true,
    },
    moduleTransform: {
      include: [/zustand/, /react\-router/],
    },
    html: {
      title: 'EMP Zustand',
    },
    debug: {
      // clearLog: false,
      // wplogger: true,
      webpackCache: false,
      // babelDebug: true,
    },
  }
})
