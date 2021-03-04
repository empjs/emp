const fs = require('fs');
const axios = require('axios');
const { resolveApp } = require('./paths');
const { remoteBaseUrlList=[] } = require(resolveApp('package.json'));

// 下载远程文件,拉取配置项的URL
async function downloadRemoteFile(urlList = remoteBaseUrlList) {
  if (urlList.length === 0) return;
  urlList.map(async (item) => {
    const file = fs.createWriteStream(`${resolveApp('src')}/${item.name}`);
    const response = await axios({
      url: item.url,
      method: "GET",
      responseType: "stream",
    });
    await response.data.pipe(file);
  });
};