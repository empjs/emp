module.exports = ({config, env, empEnv}) => {
  config.devServer.port(8002)
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: 'demo2',
        filename: 'emp.js',
        remotes: {
          '@emp/demo1': 'demo1@http://localhost:8001/emp.js',
        },
        exposes: {
          './components/Hello': 'src/components/Hello',
          './helper': 'src/helper',
        },
        shared: ['react', 'react-dom'],
      },
    }
    return args
  })
}
