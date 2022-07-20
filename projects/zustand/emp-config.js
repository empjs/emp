const {defineConfig} = require('@efox/emp')
module.exports = defineConfig(() => {
  return {
    server: {
      port: 2001,
    },
    moduleTransform: {
      useBuiltIns: 'usage',
      include: [/zustand/],
    },
    html: {
      title: 'EMP Zustand',
    },
  }
})
