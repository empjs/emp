import express, {Express} from 'express'
import cors from 'cors'
import compression from 'compression'
import store from 'src/helper/store'
import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
import logger, {logTag} from 'src/helper/logger'
import prepareURLs from 'src/cli/prepareURLs'
class Serve {
  public app: Express
  constructor() {
    const app = express()
    app.use(compression())
    app.use(cors())
    this.app = app
  }
  async setup() {
    logTag(`server running at:`)
    const staticRoot = store.resolve(store.config.build.outDir)
    const html = await fs.readFile(path.join(staticRoot, 'index.html'), 'utf8')
    this.app.use(express.static(staticRoot))
    this.app.get('*', (req, res) => res.send(html))
    const {https, host, port} = store.config.server
    const publicPath = store.config.base
    //TODO: 支持 https
    this.app.listen(port, () => {
      const protocol = https ? 'https' : 'http'
      const realHost = host || '0.0.0.0'
      const urls = prepareURLs(protocol, realHost, port as any, publicPath)
      // logger.info(`  - Run Serve At:`)
      logger.info(`- Local:   ${chalk.hex('#3498db')(urls.localUrlForTerminal)}`)
      logger.info(`- Network: ${chalk.hex('#3498db')(urls.lanUrlForTerminal)} \n`)
    })
  }
}

export default new Serve()
