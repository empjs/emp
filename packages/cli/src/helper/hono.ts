// import {type Context, Hono, type Next} from 'hono'
// import {compress} from 'hono/compress'
// // import store from 'src/store'
// import webpackDevMiddleware from 'webpack-dev-middleware'
// export const app = new Hono()
// class WdmHonoServer {
//   options: any
//   middleware: any
//   app = app
//   setupMiddlewares = (middlewares: any, devServer: any) => {
//     middlewares = []
//     devServer.app = this.app
//     this.options = devServer.options
//     const wdmHono: any = webpackDevMiddleware.honoWrapper(devServer.compiler, this.options.devMiddleware)
//     this.middleware = wdmHono.devMiddleware
//     //
//     if (this.options.compress) {
//       middlewares.push({name: 'compress', middleware: compress()})
//     }
//     if (typeof this.options.headers !== 'undefined') {
//       middlewares.push({
//         name: 'set-headers',
//         middleware: this.setHeaders,
//       })
//     }
//     //
//     middlewares.push({
//       name: 'webpack-dev-middleware',
//       middleware: wdmHono,
//     })
//     //
//     middlewares.push({
//       name: 'options-middleware',
//       middleware: async (c: Context, next: Next) => {
//         const {req, res} = c
//         if (req.method === 'OPTIONS') {
//           res.headers.append('Content-Length', '0')
//           return c.status(204)
//         }
//         await next()
//       },
//     })
//     //
//     console.log('middlewares', middlewares)
//     return middlewares
//   }
//   setHeaders = async ({req, res}: Context, next: Next) => {
//     let {headers} = this.options
//     //
//     if (headers) {
//       if (typeof headers === 'function') {
//         headers = headers(req, res, this.middleware.context)
//       }
//       const allHeaders: {key: string; value: string}[] = []
//       if (!Array.isArray(headers)) {
//         for (const name in headers) {
//           allHeaders.push({key: name, value: headers[name]})
//         }

//         headers = allHeaders
//       }
//       headers.forEach((header: {key: string; value: any}) => {
//         // res.setHeader(header.key, header.value)
//         res.headers.append(header.key, header.value)
//       })
//     }
//     await next()
//   }
// }
// export default new WdmHonoServer()
