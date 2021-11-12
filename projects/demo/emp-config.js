const {defineConfig} = require('@efox/emp')

module.exports = defineConfig({
  server: {
    port: 8000,
    // hot: 'only',
  },
  build: {
    target: 'es5',
    sourcemap: false,
    // outDir: 'build',
  },
  externals(config) {
    return [
      {
        module: 'react',
        global: 'React',
        entry:
          config.mode === 'development'
            ? `https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.development.js`
            : `https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.production.min.js`,
      },
      {
        module: 'react-dom',
        global: 'ReactDOM',
        entry:
          config.mode === 'development'
            ? 'https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.development.js'
            : 'https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.production.min.js',
      },
    ]
  },
})
