const {defineConfig} = require('@efox/emp')
const path = require('path')
module.exports = defineConfig({
  build: {
    sourcemap: true,
    lib: {
      name: 'emp-lib',
      entry: {
        index: './src/index.ts',
        'helper/logger': './src/helper/logger.ts',
      },
      // formats: ['umd', 'esm'],
      formats: ['esm'],
    },
  },
  moduleTransform: {
    parser: 'swc',
    include: [/@yy/],
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
    },
  },
})
