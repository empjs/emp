const {defineConfig} = require('@efox/emp')
module.exports = defineConfig({
  build: {
    lib: {
      name: 'myLib',
      entry: './src/index.ts',
      formats: ['umd', 'esm'],
    },
  },
})
