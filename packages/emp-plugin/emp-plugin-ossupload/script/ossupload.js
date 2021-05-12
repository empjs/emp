const Axios = require('axios')
const fs = require('fs')

const uploadOss = async (name, version) => {
  console.log(`name,version`, name, version)
  const remoteUrl = `https://npm-registry.yy.com/${name}/-/${name}-${version}.tgz`
  const uploadUrl = `https://koa-simple-test.bdgamelive.com/ossUploadString`
  try {
    const response = await Axios({
      url: remoteUrl,
      method: 'GET',
    })
    const formData = new FormData()
    formData.append('packageName', name)
    formData.append('packageVersion', version)
    formData.append('packageContent', response?.data)
    console.log('download result:', JSON.stringify(formData))
    const resupload = await Axios({
      url: uploadUrl,
      data: formData,
    })
    console.log('resupload result:', JSON.stringify(resupload))
  } catch (e) {
    console.log(e)
  }
}

module.exports = (name, version) => {
  uploadOss(name, version)
}
