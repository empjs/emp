const env = process.env.EMP_ENV || 'dev'
const dev = {
  host: 'localhost',
  port: 8008,
  publicPath: 'http://localhost:8008/',
}
const prod = {
  host: 'localhost',
  port: 8008,
  publicPath: 'http://localhost:8008/',
}
const configs = {dev, prod}
exports.getConfig = env => {
  return configs[env] || {}
}

exports.config = configs[env]
