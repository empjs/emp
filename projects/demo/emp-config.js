const {defineConfig} = require('@efox/emp')

module.exports = defineConfig({
  server: {
    port: 8080,
    // hot: 'only',
  },
  build: {
    // target: 'es5',
    sourcemap: false,
    // outDir: 'build',
  },
})
