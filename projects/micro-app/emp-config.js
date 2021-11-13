const {defineConfig} = require('@efox/emp')

module.exports = defineConfig({
  server: {
    port: 8002,
  },
  externals(config) {
    return [
      {
        module: 'react',
        global: 'React',
        entry:
          config.mode === 'development'
            ? `https://unpkg.bdgamelive.com/webupload/gfe/react@17.0.2/umd/react.development.js`
            : `https://unpkg.bdgamelive.com/webupload/gfe/react@17.0.2/umd/react.production.min.js`,
      },
      {
        module: 'react-dom',
        global: 'ReactDOM',
        entry:
          config.mode === 'development'
            ? 'https://unpkg.bdgamelive.com/webupload/gfe/react-dom@17.0.2/umd/react-dom.development.js'
            : 'https://unpkg.bdgamelive.com/webupload/gfe/react-dom@17.0.2/umd/react-dom.production.min.js',
      },
    ]
  },
  moduleFederation: {
    name: 'microApp',
    remotes: {
      '@microHost': 'microHost@http://localhost:8001/emp.js',
    },
    exposes: {
      './App': './src/App',
    },
    /* shared: {
      react: {requiredVersion: '^17.0.1'},
      'react-dom': {requiredVersion: '^17.0.1'},
    }, */
  },
  webpackChain(chain, empConfig) {
    console.log('empConfig', empConfig)
    chain.plugin('html').tap(args => {
      args[0] = {
        ...args[0],
        ...{
          title: 'Micro-App',
        },
      }
      return args
    })
  },
})
