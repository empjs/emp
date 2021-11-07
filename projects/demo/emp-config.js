const {defineConfig} = require('@efox/emp')

module.exports = defineConfig({
  appSrc: 'src',
  server: {
    port: 8001,
  },
  build: {
    target: 'es5',
    sourcemap: false,
    outDir: 'build',
  },
})
