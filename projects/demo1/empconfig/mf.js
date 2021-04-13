const empRemoteMd5 = require('@efox/emp-remote-md5')

module.exports = async env => {
  const config = require(`./mf-${env}`)
  return await empRemoteMd5(config)
}
