// const path = require('path')
// const packagePath = path.join(path.resolve('./'), 'package.json')
// const deps = require(packagePath).dependencies
// console.log(packagePath, deps)
/**
 * @type {import('@efox/emp-cli').EMPConfig}
 */
module.exports = {
  webpack() {
    return {
      devServer: {
        port: 8004,
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
    name: 'empProject',
    remotes: {
      '@emp-antd/base': 'empBase@http://localhost:8003/emp.js',
    },
    exposes: {},
    /*  shared: {
      react: {requiredVersion: '^17.0.1'},
      'react-dom': {requiredVersion: '^17.0.1'},
      'react-router-dom': {requiredVersion: '^5.1.2'},
      'mobx-react-lite': {requiredVersion: '^3.0.1'},
      mobx: {requiredVersion: '^6.0.1'},
      axios: {requiredVersion: '^0.19.2'},
    }, */
  },
}

// module.exports = ({config, env}) => {
//   // const port = 8004
//   // const projectName = 'emp-project1'
//   // const host = 'localhost'
//   // const publicPath = `http://${host}:${port}/`
//   //
//   config.plugin('html').tap(args => {
//     args[0] = {
//       ...args[0],
//       ...{
//         title: 'EMP - Project1',
//         files: {
//           // js: [`http://${host}:8003/emp.js`],
//         },
//       },
//     }
//     return args
//   })
//   ///*  */
//   config.plugin('mf').tap(args => {
//     args[0] = {
//       ...args[0],
//       ...{
//         name: 'empProject',
//         // library: {type: 'var', name: projectName},
//         filename: 'emp.js',
//         remotes: {
//           '@emp-antd/base': 'empBase@http://localhost:8003/emp.js',
//         },
//         exposes: {},
//         shared: {
//           react: {requiredVersion: '^17.0.1'},
//           'react-dom': {requiredVersion: '^17.0.1'},
//           'react-router-dom': {requiredVersion: '^5.1.2'},
//           'mobx-react-lite': {requiredVersion: '^3.0.1'},
//           mobx: {requiredVersion: '^6.0.1'},
//           axios: {requiredVersion: '^0.19.2'},
//         },
//       },
//     }
//     return args
//   })
//   config.output.publicPath(publicPath)
//   config.devServer.port(port)
// }
