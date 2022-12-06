const {defineConfig} = require('@efox/emp')
const compile = require('@efox/emp-compile-swc')
module.exports = defineConfig(() => {
  return {
    compile,
    server: {
      port: 8888,
    },
    build: {
      sourcemap: true,
      minify: 'swc',
    },
  }
})
