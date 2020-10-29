const env = process.env.EMP_ENV || 'dev'
const dev = {
  host: 'localhost',
  port: 8006,
  publicPath: 'http://localhost:8006/',
}
const prod = {
  host: 'efox-local-lab.yy.com/empvue3/components',
  port: 8006,
  publicPath: 'https://efox-local-lab.yy.com/empvue3/components/',
}
const configs = {dev, prod}
exports.getConfig = env => {
  return configs[env] || {}
}

exports.config = configs[env]
