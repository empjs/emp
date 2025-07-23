import fs from 'node:fs'
import fsp from 'node:fs/promises'
import compression from 'compression'
import connect from 'connect'
import cors from 'cors'
import http2 from 'http2'
import path from 'path'
import serveStatic from 'serve-static'
import {parse} from 'url'

//
const app = connect()
app.use(compression() as connect.NextHandleFunction)
app.use(cors())
//
export class ProdServer {
  async setup(store: any, onReady: any = () => {}) {
    // console.log(store.rsConfig.entry)
    let entry = 'index'
    const entryKeys = Object.keys(store.rsConfig.entry)
    if (entryKeys.length === 0) {
      return store.logger.sysError(`emp serve must include entry!`)
    }
    if (entryKeys.includes(entry)) {
    } else {
      entry = entryKeys[0]
    }
    if (!fs.existsSync(store.outDir)) {
      return store.logger.sysError(`emp serve must be executed after emp build,${store.outDir} not exist!`)
    }
    const staticRoot = store.resolve(store.rsConfig.output?.path as any)
    app.use(serveStatic(staticRoot))

    // 默认入口 适配 single spa
    const html = await fsp.readFile(path.join(staticRoot, `${entry}.html`), 'utf8')

    // Connect 中间件处理所有请求
    app.use((req, res, next) => {
      const parsedUrl = parse(req.url || '', true)
      const pathname = parsedUrl.pathname

      // 如果是静态资源请求且文件存在，让 serve-static 处理
      if (pathname && pathname !== '/' && fs.existsSync(path.join(staticRoot, pathname))) {
        return next()
      }

      // 否则返回 HTML
      res.setHeader('Content-Type', 'text/html')
      res.end(html)
    })

    if (store.server.isHttps) {
      const {key, cert} = await store.server.getcert()
      const http2Server = http2.createSecureServer(
        typeof store.server.isHttps !== 'boolean'
          ? store.server.isHttps
          : {
              key,
              cert,
              allowHTTP1: true,
            },
        app as any,
      )
      http2Server.listen(store.server.port, onReady)
    } else {
      const server = require('http').createServer(app)
      server.listen(store.server.port, onReady)
    }
  }
}
