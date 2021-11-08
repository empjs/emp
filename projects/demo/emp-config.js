const {defineConfig} = require('@efox/emp')

module.exports = defineConfig({
  appSrc: 'src',
  server: {
    port: 8080,
    // hot: 'only',
  },
  build: {
    target: 'es5',
    sourcemap: false,
    outDir: 'build',
  },
})
