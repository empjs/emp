const {defineConfig} = require('@efox/emp')
module.exports = defineConfig({
  build: {
    lib: {
      name: 'emp-lib',
      formats: ['umd', 'esm'],
    },
  },
})
