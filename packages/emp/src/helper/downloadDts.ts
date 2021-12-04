import store from './store'
import http from 'http'
import fs from 'fs-extra'
import path from 'path/posix'

function downloadFileAsync(uri: string, filePath: string, fileName: string) {
  return new Promise((resolve, reject) => {
    // 确保路径存在
    fs.ensureDirSync(filePath)
    const fullPath = path.resolve(filePath, fileName)
    const file = fs.createWriteStream(fullPath)
    http.get(uri, res => {
      if (res.statusCode !== 200) {
        reject(res.statusCode)
        return
      }
      res.on('end', () => {})
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
      res.pipe(file)
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
        const baseUrl = value.split('@')[1]
        const dtsUrl = baseUrl.replace('/emp.js', '/.types/index.d.ts')
        console.log(key, dtsUrl)
        try {
          downloadFileAsync(dtsUrl, 'typings', `${key}.d.ts`)
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
}
export {downloadDts}
