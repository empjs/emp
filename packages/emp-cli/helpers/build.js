const fs = require('fs-extra')
const path = require('path')

/**
 * 遍历文件夹内容
 * @param folderPath 遍历文件夹路径
 * @param fileType   需要匹配到的文件后缀，比如md
 * @param callback   匹配到该文件后的会调函数
 */
const traverseFolder = async ({folderPath, fileType, callback}) => {
  // if (!fs.existsSync(folderPath)) {
  //   console.warn(`${folderPath} not exist!`)
  //   return
  // }
  const files = await fs.readdir(folderPath)
  files.forEach(async file => {
    if (file.endsWith(`.${fileType}`)) {
      callback && callback({folderPath, file})
    } else if (!file.includes('.')) {
      traverseFolder({
        folderPath: path.join(folderPath, file),
        fileType,
        callback,
      })
    }
  })
}

function copyPublicFolder({public, dist, template, favicon}) {
  // console.log(public, dist, template, favicon)
  if (!fs.existsSync(public)) {
    console.warn('public not exist!')
    return
  }
  if (!fs.existsSync(dist)) {
    console.warn('dist not exist!')
    return
  }
  const filters = [template, favicon]
  fs.copySync(public, dist, {
    dereference: true,
    // filter: file => filters.indexOf(file) === -1,
    filter: file => {
      // console.error(file, filters.indexOf(file) === -1)
      return filters.indexOf(file) === -1
    },
  })
}

function copyEmpJsonFile({empjson, dist, empjsonDist}) {
  if (!fs.existsSync(empjson)) {
    console.warn('emp.json not exist!')
    return
  }
  if (!fs.existsSync(dist)) {
    console.warn('dist not exist!')
    return
  }
  fs.copySync(empjson, empjsonDist)
}

async function copyMdFiles({dist, appSrc, docsDist}) {
  if (!fs.existsSync(appSrc)) {
    console.warn('appSrc not exist!')
    return
  }
  if (!fs.existsSync(dist)) {
    console.warn('dist not exist!')
    return
  }

  traverseFolder({
    folderPath: appSrc,
    fileType: 'md',
    callback: ({folderPath, file}) => {
      const distPath = path.join(docsDist, folderPath.replace(`${appSrc}/`, ''), file)
      fs.copySync(path.join(folderPath, file), distPath)
    },
  })
}

function buildServeConfig(path, config) {
  // console.log(path, config)
  fs.writeJson(path, config, err => {
    if (err) return console.error(err)
    // console.log('success!')
  })
}

module.exports = {copyPublicFolder, copyEmpJsonFile, copyMdFiles, buildServeConfig}
