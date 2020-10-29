module.exports = ({config, env}) => {
  const port = 8004
  const projectName = 'emp-project1'
  const host = 'localhost'
  // const host = '172.25.200.250'
  const publicPath = `http://${host}:${port}/`
  //
  config.plugin('html').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        title: 'EMP - Project1',
        files: {
          // css: ['https://cdn.jsdelivr.net/npm/antd@4.3.1/dist/antd.min.css'],
          js: [`http://${host}:8003/emp.js`],
          // js: ['https://emp-antd-base.yy.com/emp.js'],
        },
      },
    }
    return args
  })
  ///*  */
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: projectName,
        library: {type: 'var', name: projectName},
        filename: 'emp.js',
        remotes: {
          '@emp-antd/base': 'empBase',
        },
        exposes: {},
        // shared: ['react', 'react-dom', 'react-router-dom', 'mobx-react-lite', 'mobx', 'axios'],
        shared: {
          react: {eager: true, singleton: true, requiredVersion: '^16.13.1'},
          'react-dom': {eager: true, singleton: true, requiredVersion: '^16.13.1'},
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
  // config.devServer.host(host)
  config.devServer.port(port)
}
