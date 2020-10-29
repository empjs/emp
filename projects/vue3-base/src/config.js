const env = process.env.EMP_ENV || 'dev'
const dev = {
  host: 'localhost',
  port: 8005,
  publicPath: 'http://localhost:8005/',
  baseRemote: 'http://localhost:8006',
  baseRemoteEntry: `http://localhost:8006/emp.js`,
}
const prod = {
  host: 'localhost',
  port: 8005,
  publicPath: 'http://localhost:8005/',
  baseRemote: 'http://localhost:8006',
  baseRemoteEntry: `http://localhost:8006/emp.js`,
}
const configs = {dev, prod}
exports.getConfig = env => {
  return configs[env] || {}
}

exports.config = configs[env]
