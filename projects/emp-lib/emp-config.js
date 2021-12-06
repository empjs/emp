const {defineConfig} = require('@efox/emp')
module.exports = defineConfig({
  build: {
    lib: {
      name: 'index',
      entry: 'index.ts',
      formats: ['umd', 'esm'],
    },
  },
})
