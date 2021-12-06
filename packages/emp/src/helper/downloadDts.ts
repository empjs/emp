import store from './store'
import http from 'http'
import fs from 'fs-extra'
import path from 'path'

function downloadFileAsync(uri: string, filePath: string, fileName: string, alias: string, baseName: string) {
  return new Promise((resolve, reject) => {
    http.get(uri, res => {
      if (res.statusCode !== 200) {
        reject(res.statusCode)
        return
      }
      // 确保路径存在
      fs.ensureDirSync(filePath)
      const fullPath = path.resolve(filePath, fileName)
      const file = fs.createWriteStream(fullPath)
      res.on('end', () => { })
      // 进度、超时等
      file
        .on('finish', () => {
          console.log(`finish ./${filePath}/${fileName}`)
          file.close(resolve)
        })
        .on('error', err => {
          fs.unlink(filePath, e => {
            reject(e)
          })
          reject(err.message)
        })
      res.setEncoding('utf8');
      res.on('data', function (data) {
        let newData = ''
        // 替换 remote 别名
        const regSingleQuote = new RegExp(`'${baseName}`, 'g')
        const regDoubleQuote = new RegExp(`"${baseName}`, 'g')
        newData = data.replace(regSingleQuote, `'${alias}`)
        newData = newData.replace(regDoubleQuote, `"${alias}`)
        fs.writeFileSync(fullPath, newData, 'utf8')
      });
    })
  })
}

/**
 * 下载 remote 的 d.ts
 */
const downloadDts = () => {
  const remotes = store.empShare.moduleFederation.remotes
  if (remotes) {
    for (const [key, value] of Object.entries(remotes)) {
      if (key && value) {
        const baseName = value.split('@')[0]
        const baseUrl = value.split('@')[1]
        const dtsUrl = baseUrl.replace('/emp.js', `/${store.typesOutputDir}/index.d.ts`)
        console.log(key, dtsUrl)
        downloadFileAsync(dtsUrl, store.config.typingsPath ?? path.resolve('src', 'empShareTypes'), `${key}.d.ts`, key, baseName)
      }
    }
  }
}
export { downloadDts }
