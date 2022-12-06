const {defineConfig} = require('@efox/emp')
const compile = require('@efox/emp-compile-swc')
module.exports = defineConfig(() => {
  return {
    compile,
    server: {
      port: 8887,
    },
    build: {
      sourcemap: true,
      minify: 'swc',
    },
    debug: {
      clearLog: false,
    },
  }
})
