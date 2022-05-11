const {defineConfig} = require('@efox/emp')
const path = require('path')
module.exports = defineConfig({
  moduleTransform: {
    parser: 'swc',
  },
})
