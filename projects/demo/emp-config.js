const {defineConfig} = require('@efox/emp')

module.exports = defineConfig({
  appSrc: 'src',
  build: {
    target: 'es5',
    sourcemap: false,
    outDir: 'build',
  },
})
