import express, {Express} from 'express'
import cors from 'cors'
import compression from 'compression'
import store from 'src/helper/store'
import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
import logger, {logTag} from 'src/helper/logger'
import prepareURLs from 'src/cli/prepareURLs'
import https from 'https'
import {clearConsole} from 'src/helper/utils'
class Serve {
  public app: Express
  constructor() {
    const app = express()
    app.use(compression())
    app.use(cors())
    this.app = app
  }
  startLogger({httpsOptions, host, port, publicPath}: any) {
    if (publicPath && (publicPath.indexOf('http://') > -1 || publicPath.indexOf('https://') > -1)) {
      logger.info(`- Network: ${chalk.hex('#3498db')(publicPath)} \n`)
    } else {
      const protocol = httpsOptions ? 'https' : 'http'
      const realHost = host || '0.0.0.0'
      const urls = prepareURLs(protocol, realHost, port as any, publicPath)
      // logger.info(`  - Run Serve At:`)
      logger.info(`- Local:   ${chalk.hex('#3498db')(urls.localUrlForTerminal)}`)
      logger.info(`- Network: ${chalk.hex('#3498db')(urls.lanUrlForTerminal)} \n`)
    }
  }
  async setup() {
    if (!store.config.clearLog) clearConsole()
    logTag(`server running at:`)
    const staticRoot = store.resolve(store.config.build.outDir)
    const html = await fs.readFile(path.join(staticRoot, 'index.html'), 'utf8')
    this.app.use(express.static(staticRoot))
    this.app.get('*', (req, res) => res.send(html))
    const {host, port} = store.config.server
    const httpsOptions: any = store.config.server.https
    const publicPath = store.config.base
    if (httpsOptions) {
      const httpsServer = https.createServer(httpsOptions, this.app)
      httpsServer.listen(port, () => {
        this.startLogger({httpsOptions, host, port, publicPath})
      })
    } else {
      this.app.listen(port, () => {
        this.startLogger({httpsOptions, host, port, publicPath})
      })
    }
  }
}

export default new Serve()
