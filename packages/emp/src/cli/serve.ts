import express, {Express} from 'express'
import cors from 'cors'
import compression from 'compression'
// import {getConfig} from 'src/helper/wpChain'
import store from 'src/helper/store'
import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
import logger from 'src/helper/logger'
import prepareURLs from 'src/cli/utils/prepareURLs'
class Serve {
  public app: Express
  // public readonly config = getConfig()
  constructor() {
    const app = express()
    app.use(compression())
    app.use(cors())
    this.app = app
  }
  async setup() {
    const staticRoot = store.resolve(store.config.build.outDir)
    const html = await fs.readFile(path.join(staticRoot, 'index.html'), 'utf8')
    this.app.use(express.static(staticRoot))
    this.app.get('*', (req, res) => res.send(html))
    const {https, host, port} = store.config.server
    const publicPath = store.config.base
    this.app.listen(port, () => {
      // console.log(`EMP APP listening at ${protocol}://${config.devServer.host || 'localhost'}:${config.devServer.port}`)

      const protocol = https ? 'https' : 'http'
      const realHost = host || '0.0.0.0'
      const urls = prepareURLs(protocol, realHost, port as any, publicPath)
      logger.info(`  - Run Serve At:`)
      logger.info(`  - Local:   ${chalk.cyan(urls.localUrlForTerminal)}`)
      logger.info(`  - Network: ${chalk.cyan(urls.lanUrlForTerminal)} \n`)
    })
  }
}

export default new Serve()
