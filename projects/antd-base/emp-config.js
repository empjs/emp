// const withSWC = require('@efox/emp-swc')
const ESBUILD = require('@efox/emp-esbuild')
const pkg = require('./package.json')
/**
 * @type {import('@efox/emp-cli').EMPConfig}
 */
module.exports = {
  // compile: [ESBUILD],
  webpack() {
    return {
      devServer: {
        port: 8003,
      },
    }
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
      {
        module: 'react-router-dom',
        global: 'ReactRouterDOM',
        entry: 'https://cdn.jsdelivr.net/npm/react-router-dom@5.3.0/umd/react-router-dom.min.js',
      },
      {
        module: 'mobx',
        global: 'ReactDOM',
        entry:
          config.mode === 'development'
            ? 'https://cdn.jsdelivr.net/npm/mobx@6.3.6/dist/mobx.umd.development.js'
            : 'https://cdn.jsdelivr.net/npm/mobx@6.3.6/dist/mobx.umd.production.min.js',
      },
      {
        module: 'mobx-react-lite',
        global: 'mobxReactLite',
        entry:
          config.mode === 'development'
            ? 'https://cdn.jsdelivr.net/npm/mobx-react-lite@3.2.2/dist/mobxreactlite.umd.development.js'
            : 'https://cdn.jsdelivr.net/npm/mobx-react-lite@3.2.2/dist/mobxreactlite.umd.production.min.js',
      },
      {
        module: 'axios',
        global: 'axios',
        entry: 'https://cdn.jsdelivr.net/npm/axios@0.24.0/dist/axios.min.js',
      },
    ]
  },
  moduleFederation: {
    name: 'empBase',
    // library: {type: 'var', name: 'empBase'},
    // filename: 'emp.js',
    remotes: {},
    exposes: {
      './App': 'src/App',
      './stores/index': 'src/stores/index',
      './components/common/crud/index': 'src/components/common/crud/index',
      './components/common/RouterComp': 'src/components/common/RouterComp',
    },
    // shared: pkg.dependencies,
    /*     shared: {
      react: pkg.dependencies.react,
      'react-dom': pkg.dependencies['react-dom'],
      'react-router-dom': pkg.dependencies['react-router-dom'],
      'mobx-react-lite': pkg.dependencies['mobx-react-lite'],
      mobx: pkg.dependencies.mobx,
      axios: pkg.dependencies.axios,
    }, */
  },
  webpackChain(config) {
    config.plugin('html').tap(args => {
      args[0] = {
        ...args[0],
        ...{
          title: 'EMP BASE',
        },
      }
      return args
    })
  },
}

/* module.exports = ({config, env}) => {
  const port = 8003
  const projectName = 'empBase'
  const host = 'localhost'
  // const host = '172.25.200.250'
  const publicPath = `http://${host}:${port}/`
  // html
  config.plugin('html').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        title: 'EMP BASE',
        files: {
          // css: ['https://cdn.jsdelivr.net/npm/antd@4.3.1/dist/antd.min.css'],
        },
      },
    }
    return args
  })
  // mf
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: projectName,
        library: {type: 'var', name: projectName},
        filename: 'emp.js',
        remotes: {},
        exposes: {
          './App': 'src/App',
          './stores/index': 'src/stores/index',
          './components/common/crud/index': 'src/components/common/crud/index',
          './components/common/RouterComp': 'src/components/common/RouterComp',
        },
        // shared: ['react', 'react-dom', 'react-router-dom', 'mobx-react-lite', 'mobx', 'axios'],
        shared: {
          react: {requiredVersion: '^17.0.1'},
          'react-dom': {requiredVersion: '^17.0.1'},
          'react-router-dom': {requiredVersion: '^5.1.2'},
          'mobx-react-lite': {requiredVersion: '^3.0.1'},
          mobx: {requiredVersion: '^6.0.1'},
          axios: {requiredVersion: '^0.19.2'},
        },
      },
    }
    return args
  })
  config.output.publicPath(publicPath)
  config.devServer.host(host)
  config.devServer.port(port)
  // config.externals({react: 'https://unpkg.com/react@16.13.1/umd/react.production.min.js'})
  // config.merge({externals: {react: 'https://unpkg.com/react@16.13.1/umd/react.production.min.js'}})
}
 */
