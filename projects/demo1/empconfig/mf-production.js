const {shareByVersion} = require('./unit')
module.exports = {
  name: 'demo1',
  filename: 'emp.js',
  remotes: {
    '@emp/demo2': 'demo2@http://127.0.0.1:8002/emp.js',
    '@emp/demo3': 'demo3@http://127.0.0.1:8003/emp.js',
  },
  exposes: {
    './configs/index': 'src/configs/index',
    './components/Demo': 'src/components/Demo',
    './components/Hello': 'src/components/Hello',
  },
  shared: {
    react: {eager: true, singleton: true, requiredVersion: '^17.0.1'},
    'react-dom': {eager: true, singleton: true, requiredVersion: '^17.0.1'},
  },
  // shared: Object.assign({}, shareByVersion('react'), shareByVersion('react-dom')),
}
