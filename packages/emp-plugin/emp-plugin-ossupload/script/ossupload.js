const FormData = require('form-data')
const fs = require('fs')
const download = require('../helps/download')
const axios = require('axios')
const {resolveApp} = require('../helps/paths')
const package = require(`${resolveApp('package.json')}`)

const uploadOss = async (packageName, packageVersion) => {
  const name = packageName || package.name
  const version = packageVersion || package.version
  console.log(`name,version`, name, version)
  const remoteUrl = `https://npm-registry.yy.com/${name}/-/${name}-${version}.tgz`
  const uploadUrl = `https://koa-simple-test.bdgamelive.com/ossUpload`
  console.log('开始下载', remoteUrl)
  try {
    const downloadResult = await download(`${name}-${version}.tgz`, remoteUrl)
    const formData = new FormData()
    const stream = fs.createReadStream(downloadResult.filePath, {highWaterMark: 1})

    formData.append('custompath', `/unpkg/${name.replace(/\//g, '-')}/${version}/`)
    formData.append('file', stream)
    const formHeaders = formData.getHeaders()
    console.log('上传包名:', name)
    console.log('上传版本号:', version)
    console.log('开始上传..')
    await axios
      .post(uploadUrl, formData, {
        headers: {
          ...formHeaders,
        },
      })
      .then(response => {
        console.log('上传结果状态:', response?.status)
        if (response?.status === 200) {
          console.log('资源线上地址:', response?.data?.url)
        }
        // fs.unlinkSync(downloadResult.filePath)
      })
      .catch(error => {
        console.log('upload error', error)
        // fs.unlinkSync(downloadResult.filePath)
      })
    fs.rmdirSync(resolveApp('uploadtemplate'), {recursive: true})
  } catch (e) {
    console.log(e)
    fs.rmdirSync(resolveApp('uploadtemplate'), {recursive: true})
  }
}

module.exports = (name, version) => {
  uploadOss(name, version)
}
