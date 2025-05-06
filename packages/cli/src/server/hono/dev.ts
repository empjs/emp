// import {serve} from '@hono/node-server'
// import {Hono} from 'hono'
// import type {Compiler, GlobalStore, RspackOptions} from 'src/index'
// import type {DevServerType} from 'src/server/types'
// import wdm from 'webpack-dev-middleware'
// import RspackDevServer from 'webpack-dev-server'
// export class DevServer implements DevServerType {
//   async setup(compiler: Compiler, rspackConfig: RspackOptions, store: GlobalStore, onReady: any = () => {}) {
//     const devServer: any = rspackConfig.devServer || {}
//     devServer.setupMiddlewares = (_: any, dev: any) => [
//       {
//         name: 'webpack-dev-middleware',
//         middleware: wdm.honoWrapper(dev.compiler),
//       },
//     ]
//     devServer.app = () => new Hono()
//     devServer.server = async (_: any, app: any) => {
//       let op = {
//         fetch: app.fetch,
//       }
//       op = await this.setHttps(op, store)
//       return serve(op)
//     }
//     // devServer.setup = (app: any) => {
//     //   app.middleware.waitUntilValid(onReady)
//     // }
//     //
//     const app = new RspackDevServer(rspackConfig.devServer, compiler as any)
//     await app.start()
//     // app.middleware?.waitUntilValid(onReady)
//     return app
//   }
//   async beforeCompiler(rspackConfig: any) {
//     // const {devServer} = rspackConfig
//     // devServer.setupMiddlewares = (_: any, dev: any) => [
//     //   {
//     //     name: 'webpack-dev-middleware',
//     //     middleware: wdm.honoWrapper(dev.compiler),
//     //   },
//     // ]
//     // devServer.app = () => new Hono()
//     // devServer.server = (_: any, app: any) =>
//     //   serve({
//     //     fetch: app.fetch,
//     //   })
//     return rspackConfig
//   }
//   private async setHttps(op: any, store: any) {
//     if (store.server.isHttps) {
//       const [key, cert] = await store.server.getcert()
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
