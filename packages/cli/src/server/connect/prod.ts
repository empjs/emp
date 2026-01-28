import fs from 'node:fs'
import fsp from 'node:fs/promises'
import compression from 'compression'
import connect from 'connect'
import cors from 'cors'
import {createProxyMiddleware} from 'http-proxy-middleware'
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

    // 配置 proxy 代理
    // console.log('store.server.proxy', store.empConfig.server.proxy)
    if (store.empConfig.server.proxy && Array.isArray(store.empConfig.server.proxy)) {
      store.empConfig.server.proxy.forEach((proxyItem: any) => {
        const {context, ...options} = proxyItem
        // context 可以是字符串或字符串数组
        // 在 http-proxy-middleware v2.x 中，使用 pathFilter 来指定要代理的路径
        app.use(
          createProxyMiddleware({
            ...options,
            pathFilter: context,
          }) as connect.NextHandleFunction,
        )
      })
    }

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
