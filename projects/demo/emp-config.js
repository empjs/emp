const {defineConfig} = require('@efox/emp')

module.exports = defineConfig({
  base: '/',
  html: {title: 'Demo | EMP v2'},
  server: {
    port: 8000,
    // hot: 'only',
  },
  build: {
    target: 'es5',
    sourcemap: false,
    // outDir: 'build',
  },
  empShare(config) {
    const {mode} = config
    console.log('emp-config of demo', config)
    return {
      shareLib: {
        react:
          mode === 'development'
            ? `React@https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.development.js`
            : `React@https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.production.min.js`,
        'react-dom':
          mode === 'development'
            ? 'ReactDOM@https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.development.js'
            : 'ReactDOM@https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.production.min.js',
      },
    }
  },
})
