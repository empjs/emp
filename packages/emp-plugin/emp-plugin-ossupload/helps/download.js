const fs = require('fs')
const fse = require('fs-extra')
const axios = require('axios')
const {resolveApp} = require('./paths')

const download = async (fileName, downloadUrl, type) => {
  const isExists = await fse.pathExists(`${resolveApp('uploadtemplate')}`)
  if (!isExists) {
    await fse.mkdir(`${resolveApp('uploadtemplate')}`)
  }
  const filePath = `${resolveApp('uploadtemplate')}/${fileName.replace(/\//g, '-')}`
  // console.log('filePath', filePath)
  const file = fs.createWriteStream(filePath)

  const response = await axios({
    url: `${downloadUrl}`,
    method: 'GET',
    responseType: type || 'stream',
  })

  !type && (await response.data.pipe(file))
  return {filePath, response}
}

module.exports = download
