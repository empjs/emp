const {defineConfig} = require('@efox/emp')
module.exports = defineConfig({
  build: {
    lib: {
      name: 'emp-lib',
      entry: './src/index.ts',
      formats: ['umd', 'esm'],
    },
  },
})
