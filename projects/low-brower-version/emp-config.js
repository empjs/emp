const {defineConfig} = require('@efox/emp')
module.exports = defineConfig(() => {
  return {
    html: {title: 'Low Brower Version of EMP'},
    server: {
      port: 8000,
      https: true,
    },
  }
})
