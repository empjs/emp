const Axios = require('axios')
const crypto = require('crypto')

const empRemoteMd5 = async config => {
  const remotesKey = Object.keys(config.remotes)
  for (const remoteKey of remotesKey) {
    const atIndex = config.remotes[remoteKey].indexOf('@')
    const fileUrl = config.remotes[remoteKey].substring(atIndex + 1)
    try {
      const response = await Axios({
        url: `${fileUrl}?fetchTime=${new Date().getTime()}`,
        method: 'GET',
      })
      const fileMd5 = crypto.createHash('md5').update(response.data).digest('hex')
      if (atIndex > -1) {
        config.remotes[remoteKey] = `${config.remotes[remoteKey]}?md5=${fileMd5}`
      } else {
        config.remotes[remoteKey] = fileUrl
      }
    } catch (e) {
      console.log(e)
    }
  }
  return config
}

module.exports = empRemoteMd5
