const Axios = require('axios')
const FormData = require('form-data')
const http = require('http')

const uploadOss = async (name, version) => {
  console.log(`name,version`, name, version)
  const remoteUrl = `https://npm-registry.yy.com/${name}/-/${name}-${version}.tgz`
  const uploadUrl = `https://koa-simple-test.bdgamelive.com/ossUploadString`
  console.log('开始下载', remoteUrl)
  try {
    const response = await Axios({
      url: remoteUrl,
      method: 'GET',
    })
    console.log('上传包名:', name)
    console.log('上传版本号:', version)
    const formData = new FormData()
    formData.append('packageName', name)
    formData.append('packageVersion', version)
    formData.append('packageContent', response?.data)
    console.log('开始上传..')
    var request = http.request({
      method: 'post',
      host: 'koa-simple-test.bdgamelive.com',
      path: '/ossUploadString',
      headers: formData.getHeaders(),
    })

    formData.pipe(request)
    request.on('response', function (res) {
      console.log('上传结果:', res.statusCode)
    })
  } catch (e) {
    console.log(e)
  }
}

module.exports = (name, version) => {
  uploadOss(name, version)
}
