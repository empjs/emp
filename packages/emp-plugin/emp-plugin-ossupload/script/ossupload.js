const FormData = require('form-data')
const fs = require('fs')
const download = require('../helps/download')
const axios = require('axios')

const uploadOss = async (name, version) => {
  console.log(`name,version`, name, version)
  const remoteUrl = `https://npm-registry.yy.com/${name}/-/${name}-${version}.tgz`
  const uploadUrl = `https://koa-simple-test.bdgamelive.com/ossUpload`
  console.log('开始下载', remoteUrl)
  try {
    const filePath = await download(`${name}-${version}.tgz`, remoteUrl)
    const formData = new FormData()
    const stream = fs.createReadStream(filePath)

    formData.append('custompath', `/unpkg/${name.replace(/\//g, '-')}/${version}/`)
    formData.append('file', stream)
    const formHeaders = formData.getHeaders()
    console.log('上传包名:', name)
    console.log('上传版本号:', version)
    console.log('开始上传..')
    axios
      .post(uploadUrl, formData, {
        headers: {
          ...formHeaders,
        },
      })
      .then(response => {
        console.log('upload then', response?.status)
      })
      .catch(error => {
        console.log('upload error', error)
      })
    fs.unlinkSync(filePath)
  } catch (e) {
    console.log(e)
  }
}

module.exports = (name, version) => {
  uploadOss(name, version)
}
