import fs from 'node:fs'
import fsp from 'node:fs/promises'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import https from 'https'
import path from 'path'

//
const app = express()
app.use(compression())
app.use(cors())
//
export class ProdServer {
  async setup(store: any, onReady: any = () => {}) {
    if (!fs.existsSync(store.outDir)) {
      return store.logger.sysError(`emp serve must be executed after emp build,${store.outDir} not exist!`)
    }
    const staticRoot = store.resolve(store.rsConfig.output?.path as any)
    app.use(express.static(staticRoot))
    // 默认入口 适配 single spa
    const html = await fsp.readFile(path.join(staticRoot, 'index.html'), 'utf8')
    app.get('*', (req, res) => res.send(html))
    if (store.server.isHttps) {
      const {key, cert} = await store.server.getcert()
      const httpsServer = https.createServer(
        typeof store.server.isHttps !== 'boolean'
          ? store.server.isHttps
          : {
              key,
              cert,
            },
        app,
      )
      httpsServer.listen(store.server.port, onReady)
    } else {
      app.listen(store.server.port, onReady)
    }
  }
}
