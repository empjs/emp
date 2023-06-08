const {defineConfig} = require('@efox/emp')
module.exports = defineConfig(() => {
  return {
    webpackChain(wpChain) {
      wpChain.plugin('tailwind').use(require('tailwind'), [])
    },
  }
})
