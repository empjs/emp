const port = 8002
/**
 * @type {import('@efox/emp-cli').EMPConfig}
 */
module.exports = {
  // splitCss: false,
  entries: {},
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
  webpack() {
    return {
      devServer: {
        port,
      },
    }
  },
  pages: {
    router: {
      'info/user': {
        title: '用户信息 demo',
      },
    },
  },
  webpackChain(config) {
    config.plugin('html').tap(args => {
      args[0].files.publicPath = `http://localhost:${port}`
      // console.log(args)
      return args
    })
  },
  async moduleFederation() {
    return {
      name: 'demo2',
      filename: 'emp.js',
      remotes: {
        '@emp/demo1': 'demo1@http://localhost:8001/emp.js',
      },
      exposes: {
        './components/Hello': './src/components/Hello',
        './helper': './src/helper',
      },
      /* shared: {
        react: {requiredVersion: '^17.0.1'},
        'react-dom': {requiredVersion: '^17.0.1'},
      }, */
    }
  },
}
