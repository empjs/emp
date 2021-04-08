const internalIp = require('internal-ip')
//
function getHostname(hostname) {
  if (hostname === 'local-ip') {
    hostname = internalIp.v4.sync() || internalIp.v6.sync() || '0.0.0.0'
  } else if (hostname === 'local-ipv4') {
    hostname = internalIp.v4.sync() || '0.0.0.0'
  } else if (hostname === 'local-ipv6') {
    hostname = internalIp.v6.sync() || '::'
  }
  return hostname
}
function getDevHost(host) {
  if (!host) {
    host = internalIp.v4.sync() || internalIp.v6.sync() || 'localhost'
  }
  return host
}

module.exports = {
  getHostname,
  getDevHost,
}
