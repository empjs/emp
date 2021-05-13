const fs = require('fs')
const fse = require('fs-extra')
const axios = require('axios')
const {resolveApp} = require('./paths')

const download = async (fileName, downloadUrl) => {
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
    responseType: 'stream',
  })

  await response.data.pipe(file)
  return filePath
}

module.exports = download
