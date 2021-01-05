module.exports = ({config, env}) => {
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
          react: {eager: true, singleton: true, requiredVersion: '^17.0.1'},
          'react-dom': {eager: true, singleton: true, requiredVersion: '^17.0.1'},
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
