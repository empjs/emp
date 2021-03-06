// "dev": "emp dev -rm --ts "
// 用于拉取自定义的base项目的远程声明文件
/**
 * package.json
 * {
 *  "remoteBaseUrlList": [
 *      {
 *        "url": "https://com/index.d.ts"
 *        "name": "文件名.d.ts"
 *      }
 *   ]
 * } 
 */
const fs = require('fs')
const axios = require('axios')
const { resolveApp } = require('./paths')
const { remoteBaseUrlList=[] } = require(resolveApp('package.json'))

// 下载远程文件,拉取配置项的URL
async function downloadRemoteFile(urlList = remoteBaseUrlList) {
  if (urlList.length === 0) return
  urlList.map(async (item) => {
    let name = `${a.replace('/', '-')}${/[^*].d.ts/.test(a)?'':'.d.ts'}`
    const file = fs.createWriteStream(`${resolveApp('src')}/${name}`)
    const response = await axios({
      url: item.url,
      method: "GET",
      responseType: "stream",
    })
    
    await response.data.pipe(file)
  })
}

module.exports = downloadRemoteFile
