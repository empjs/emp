import https from 'https'
import fs from 'fs-extra'
import path from 'path'
import axios from 'axios'
import store from 'src/helper/store'
import logger from 'src/helper/logger'
import {createSpinner} from 'nanospinner'
class Dts {
  async downloadFileAsync(uri: string, filePath: string, fileName: string, alias: string, baseName: string) {
    const spinner = createSpinner().start()
    spinner.start({text: `[download ${fileName}]:${uri}\n`})
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
      await fs.ensureDir(filePath)
      const fullPath = path.resolve(filePath, fileName)
      spinner.success({text: `[${fileName}]:${fullPath}\n`})
      fs.writeFileSync(fullPath, newData, 'utf8')
    } catch (error) {
      // logger.error(error)
      logger.error(`${uri} --> network error`)
    }
  }
  /**
   * 下载 remote 的 d.ts
   */
  async downloadDts() {
    const remotes = store.empShare.moduleFederation.remotes
    if (remotes) {
      for (const [key, value] of Object.entries(remotes)) {
        if (key && value) {
          const splitIndex = value.indexOf('@')
          if (splitIndex === -1) throw Error(`[emp dts] invaild remotes url: ${value}`)
          const baseName = value.substr(0, splitIndex)
          const baseUrl = value.substr(splitIndex + 1)
          const {outDir, typesOutDir} = store.config.build
          // typesOutDir 可以独立设置 但是必须在outDir里，否则影响DTS同步
          const dtsUrl = baseUrl.replace('/emp.js', `${typesOutDir.replace(outDir, '')}/index.d.ts`)
          await this.downloadFileAsync(dtsUrl, store.config.typingsPath, `${key}.d.ts`, key, baseName)
        }
      }
    } else {
      logger.warn('No found remotes')
    }
  }

  async setup() {
    await this.downloadDts()
  }
}
export default new Dts()
