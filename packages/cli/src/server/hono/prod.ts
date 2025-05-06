// import fsp from 'node:fs/promises'
// import path from 'path'
// import {serve} from '@hono/node-server'
// import {Hono} from 'hono'
// import {compress} from 'hono/compress'
// import {cors} from 'hono/cors'
// import {etag} from 'hono/etag'
// import {serveStatic} from 'hono/serve-static'
// const app = new Hono()
// app.use(compress())
// app.use(cors())
// app.use(etag())
// type ServeArgs = Parameters<typeof serve>[0]
// export class ProdServer {
//   async setup(store: any, onReady: any = () => {}) {
//     app.use(
//       '*',
//       serveStatic({
//         root: '/',
//         pathResolve(filePath: string) {
//           filePath = path.join(store.outDir, filePath)
//           // console.log('pathResolve', filePath)
//           return filePath
//         },
//         getContent(filePath, c) {
//           const rs = fsp.readFile(filePath)
//           // console.log(rs)
//           return rs
//         },
//       }),
//     )
//     //
//     let op: ServeArgs = {
//       port: store.server.port,
//       fetch: app.fetch,
//     }
//     op = await this.setHttps(op, store)
//     serve(op, onReady)
//   }
//   private async setHttps(op: any, store: any) {
//     if (store.server.isHttps) {
//       const {key, cert} = await store.server.getcert()
//       const {createSecureServer} = await import('node:http2')
//       op = {
//         ...op,
//         createServer: createSecureServer,
//         serverOptions: {
//           key,
//           cert,
//         },
//       }
//     }
//     return op
//   }
// }
