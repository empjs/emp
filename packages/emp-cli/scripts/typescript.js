const Axios = require('axios')
const chalk = require('chalk') // 支持修改控制台中字符串的样式 字体样式、字体颜色、背景颜色
//
const {getPaths, setPaths, resolveApp} = require('../helpers/paths')
const fs = require('fs-extra')
const path = require('path')
const {generateType} = require('@efox/emp-tune-dts-plugin')

async function download(remoteUrl, saveName, savePath) {
  const file = fs.createWriteStream(resolveApp(path.join(savePath, saveName)))
  const response = await Axios({
    url: remoteUrl,
    method: 'GET',
    responseType: 'stream',
  })
  response.data.pipe(file)
  return new Promise((resolve, reject) => {
    file.on('finish', resolve)
    file.on('error', reject)
  })
}

module.exports = async (type, {createName, createPath, remoteUrl, saveName, savePath}) => {
  await setPaths({})
  switch (type) {
    case 'create':
      createName = createName || 'index.d.ts'
      createPath = createPath ? resolveApp(createPath) : resolveApp('dist')
      const {dist} = getPaths()
      const errMsg =
        createPath === dist
          ? `you can run [emp tsc] after [emp build] or [emp build --ts] instead!`
          : `you can mkdir ${createPath} fix it!`
      console.log(createPath, dist)
      if (await fs.pathExists(createPath)) {
        generateType({
          output: path.join(createPath, createName),
          path: createPath,
          name: createName,
          isDefault: true,
        })
      } else {
        // console.error(`${createPath} not exist, please tsc after build!`)
        console.log(
          chalk.red.bold(`${createPath} not exist,
        ${errMsg}`),
        )
      }
      break
    case 'sync':
      savePath = savePath || 'src'
      saveName = saveName || 'empType.d.ts'
      await download(remoteUrl, saveName, savePath)
      break
  }
}
