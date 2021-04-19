const Axios = require('axios')
const crypto = require('crypto')

const empRemoteMd5 = async config => {
  const remotesKey = Object.keys(config.remotes)
  for (const remoteKey of remotesKey) {
    const remote = config.remotes[remoteKey].split('@')
    const fileUrl = remote[remote.length - 1]
    try {
      const response = await Axios({
        url: fileUrl,
        method: 'GET',
      })
      const fileMd5 = crypto.createHash('md5').update(response.data).digest('hex')
      if (remote.length > 0) {
        config.remotes[remoteKey] = `${remote[0]}@${fileUrl}?md5=${fileMd5}`
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
