// import {parse} from 'url'
// import config from './config'

// export const pathMatch = function (url: string, path: string) {
//   try {
//     return parse(url).pathname === path
//   } catch (e) {
//     return false
//   }
// }

// export default function webpackHotMiddleware(compiler: any, opts?: any) {
//   opts = opts || config
//   opts.log = typeof opts.log == 'undefined' ? console.log.bind(console) : opts.log
//   opts.path = opts.path || '/__webpack_hmr'
//   opts.heartbeat = opts.heartbeat || 10 * 1000
//   opts.statsOptions = typeof opts.statsOptions == 'undefined' ? {} : opts.statsOptions

//   let eventStream: any = createEventStream(opts.heartbeat)
//   let latestStats: any = null
//   let closed = false

//   if (compiler.hooks) {
//     compiler.hooks.invalid.tap('webpack-hot-middleware', onInvalid)
//     compiler.hooks.done.tap('webpack-hot-middleware', onDone)
//   } else {
//     compiler.plugin('invalid', onInvalid)
//     compiler.plugin('done', onDone)
//   }
//   function onInvalid() {
//     if (closed) return
//     latestStats = null
//     if (opts.log) opts.log('webpack building...')
//     eventStream.publish({action: 'building'})
//   }
//   function onDone(statsResult: any) {
//     if (closed) return
//     // Keep hold of latest stats so they can be propagated to new clients
//     latestStats = statsResult
//     publishStats('built', latestStats, eventStream, opts.log, opts.statsOptions)
//   }
//   const middleware = function (req: any, res: any, next: any) {
//     if (closed) return next()
//     if (!pathMatch(req.url, opts.path)) return next()
//     eventStream.handler(req, res)
//     if (latestStats) {
//       // Explicitly not passing in `log` fn as we don't want to log again on
//       // the server
//       publishStats('sync', latestStats, eventStream, false, opts.statsOptions)
//     }
//   }
//   middleware.publish = function (payload: any) {
//     if (closed) return
//     eventStream.publish(payload)
//   }
//   middleware.close = function () {
//     if (closed) return
//     // Can't remove compiler plugins, so we just set a flag and noop if closed
//     // https://github.com/webpack/tapable/issues/32#issuecomment-350644466
//     closed = true
//     eventStream.close()
//     eventStream = null
//   }
//   return middleware
// }

// function createEventStream(heartbeat: any) {
//   let clientId = 0
//   let clients: any = {}
//   function everyClient(fn: any) {
//     Object.keys(clients).forEach(function (id) {
//       fn(clients[id])
//     })
//   }
//   const interval = setInterval(function heartbeatTick() {
//     everyClient(function (client: any) {
//       client.write('data: \uD83D\uDC93\n\n')
//     })
//   }, heartbeat).unref()
//   return {
//     close: function () {
//       clearInterval(interval)
//       everyClient(function (client: any) {
//         if (!client.finished) client.end()
//       })
//       clients = {}
//     },
//     handler: function (req: any, res: any) {
//       const headers = {
//         'Access-Control-Allow-Origin': '*',
//         'Content-Type': 'text/event-stream;charset=utf-8',
//         'Cache-Control': 'no-cache, no-transform',
//         // While behind nginx, event stream should not be buffered:
//         // http://nginx.org/docs/http/ngx_http_proxy_module.html#proxy_buffering
//         'X-Accel-Buffering': 'no',
//       }

//       const isHttp1 = !(parseInt(req.httpVersion) >= 2)
//       if (isHttp1) {
//         req.socket.setKeepAlive(true)
//         Object.assign(headers, {
//           Connection: 'keep-alive',
//         })
//       }

//       res.writeHead(200, headers)
//       res.write('\n')
//       const id = clientId++
//       clients[id] = res
//       req.on('close', function () {
//         if (!res.finished) res.end()
//         delete clients[id]
//       })
//     },
//     publish: function (payload: any) {
//       everyClient(function (client: any) {
//         client.write('data: ' + JSON.stringify(payload) + '\n\n')
//       })
//     },
//   }
// }

// function publishStats(action: any, statsResult: any, eventStream: any, log: any, statsOptions: any) {
//   const resultStatsOptions = Object.assign(
//     {
//       all: false,
//       cached: true,
//       children: true,
//       modules: true,
//       timings: true,
//       hash: true,
//       errors: true,
//       warnings: true,
//     },
//     statsOptions,
//   )

//   let bundles = []

//   // multi-compiler stats have stats for each child compiler
//   // see https://github.com/webpack/webpack/blob/main/lib/MultiCompiler.js#L97
//   if (statsResult.stats) {
//     const processed = statsResult.stats.map(function (stats: any) {
//       return extractBundles(normalizeStats(stats, resultStatsOptions))
//     })

//     bundles = processed.flat()
//   } else {
//     bundles = extractBundles(normalizeStats(statsResult, resultStatsOptions))
//   }

//   bundles.forEach(function (stats: any) {
//     let name = stats.name || ''

//     // Fallback to compilation name in case of 1 bundle (if it exists)
//     if (!name && stats.compilation) {
//       name = stats.compilation.name || ''
//     }

//     if (log) {
//       log('webpack built ' + (name ? name + ' ' : '') + stats.hash + ' in ' + stats.time + 'ms')
//     }

//     eventStream.publish({
//       name: name,
//       action: action,
//       time: stats.time,
//       hash: stats.hash,
//       warnings: formatErrors(stats.warnings || []),
//       errors: formatErrors(stats.errors || []),
//       modules: buildModuleMap(stats.modules),
//     })
//   })
// }

// function formatErrors(errors: any) {
//   if (!errors || !errors.length) {
//     return []
//   }

//   if (typeof errors[0] === 'string') {
//     return errors
//   }

//   // Convert webpack@5 error info into a backwards-compatible flat string
//   return errors.map(function (error: any) {
//     const moduleName = error.moduleName || ''
//     const loc = error.loc || ''
//     return moduleName + ' ' + loc + '\n' + error.message
//   })
// }

// function normalizeStats(stats: any, statsOptions: any) {
//   const statsJson = stats.toJson(statsOptions)

//   if (stats.compilation) {
//     // webpack 5 has the compilation property directly on stats object
//     Object.assign(statsJson, {
//       compilation: stats.compilation,
//     })
//   }

//   return statsJson
// }

// function extractBundles(stats: any) {
//   // Stats has modules, single bundle
//   if (stats.modules) return [stats]

//   // Stats has children, multiple bundles
//   if (stats.children && stats.children.length) return stats.children

//   // Not sure, assume single
//   return [stats]
// }

// function buildModuleMap(modules: any) {
//   const map: any = {}
//   modules.forEach(function (module: any) {
//     map[module.id] = module.name
//   })
//   return map
// }
