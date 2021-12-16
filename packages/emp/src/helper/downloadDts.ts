import store from './store'
import http from 'http'
import https from 'https'
import fs from 'fs-extra'
import path from 'path'
import axios from 'axios'

async function downloadFileAsync(uri: string, filePath: string, fileName: string, alias: string, baseName: string) {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  })
  axios.defaults.httpsAgent = httpsAgent
  try {
    const {data} = await axios.get(uri)
    let newData = ''
    // 替换 remote 别名
    const regSingleQuote = new RegExp(`'${baseName}`, 'g')
    const regDoubleQuote = new RegExp(`"${baseName}`, 'g')
    newData = data.replace(regSingleQuote, `'${alias}`)
    newData = newData.replace(regDoubleQuote, `"${alias}`)
    const fullPath = path.resolve(filePath, fileName)
    console.log(`${uri} --> ${fullPath}`)
    fs.writeFileSync(fullPath, newData, 'utf8')
  } catch (error) {
    console.log(error)
    console.log(`${uri} --> network error`)
  }
}

/**
 * 下载 remote 的 d.ts
 */
const downloadDts = async () => {
  const remotes = store.empShare.moduleFederation.remotes
  if (remotes) {
    for (const [key, value] of Object.entries(remotes)) {
      if (key && value) {
        const baseName = value.split('@')[0]
        const baseUrl = value.split('@')[1]
        const {outDir, typesOutDir} = store.config.build
        // typesOutDir 可以独立设置 但是必须在outDir里，否则影响DTS同步
        const dtsUrl = baseUrl.replace('/emp.js', `${typesOutDir.replace(outDir, '')}/index.d.ts`)
        await downloadFileAsync(dtsUrl, store.config.typingsPath, `${key}.d.ts`, key, baseName)
      }
    }
  } else {
    console.log('No found remotes')
  }
}
export {downloadDts}
