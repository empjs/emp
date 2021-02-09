module.exports = ({config, env, empEnv}) => {
  config.devServer.port(8002)
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: 'diff17',
        filename: 'emp.js',
        remotes: {
          '@emp/diff16': 'diff16@http://localhost:8001/emp.js',
        },
        exposes: {
          './components/Hello': 'src/components/Hello',
          './newReact': require.resolve('react'),
          './newReactDOM': require.resolve('react-dom'),
        },
        shared: ['react', 'react-dom'],
      },
    }
    return args
  })
}
