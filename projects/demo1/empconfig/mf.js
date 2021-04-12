const Axios = require('axios')
const md5 = require('md5')

const empFileMd5 = async config => {
  const remotesKey = Object.keys(config.remotes)
  for (const remoteKey of remotesKey) {
    const remote = config.remotes[remoteKey].split('@')
    const fileUrl = remote[remote.length - 1]
    const response = await Axios({
      url: fileUrl,
      method: 'GET',
    })
    const fileMd5 = md5(response.data)
    console.log(fileMd5)
    if (remote.length > 0) {
      config.remotes[remoteKey] = `${remote[0]}@${fileUrl}?md5=${fileMd5}`
    } else {
      config.remotes[remoteKey] = fileUrl
    }
  }
  return config
}

module.exports = async env => {
  const config = require(`./mf-${env}`)
  return await empFileMd5(config)
}
