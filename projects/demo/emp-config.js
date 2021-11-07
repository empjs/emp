const {defineConfig} = require('@efox/emp')

module.exports = defineConfig({
  appSrc: 'src',
  server: {
    port: 8080,
  },
  build: {
    // target: 'es5',
    sourcemap: false,
    outDir: 'build',
  },
})
