// import strip from 'strip-ansi'
// import clientOverlay from './overlay'
// import processUpdate from './process-update'
// import config from './config'
// //
// const options: any = config

// if (__resourceQuery) {
//   const params = Array.from(new URLSearchParams(__resourceQuery.slice(1)))
//   const overrides = params.reduce(function (memo: any, param) {
//     memo[param[0]] = param[1]
//     return memo
//   }, {})

//   setOverrides(overrides)
// }

// if (typeof window === 'undefined') {
//   // do nothing
// } else if (typeof window.EventSource === 'undefined') {
//   console.warn(
//     "webpack-hot-middleware's client requires EventSource to work. " +
//       'You should include a polyfill if you want to support this browser: ' +
//       'https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools',
//   )
// } else {
//   if (options.autoConnect) {
//     connect()
//   }
// }

// /* istanbul ignore next */
// function setOptionsAndConnect(overrides: any) {
//   setOverrides(overrides)
//   connect()
// }

// function setOverrides(overrides: any) {
//   if (overrides.autoConnect) options.autoConnect = overrides.autoConnect == 'true'
//   if (overrides.path) options.path = overrides.path
//   if (overrides.timeout) options.timeout = overrides.timeout
//   if (overrides.overlay) options.overlay = overrides.overlay !== 'false'
//   if (overrides.reload) options.reload = overrides.reload !== 'false'
//   if (overrides.noInfo && overrides.noInfo !== 'false') {
//     options.log = false
//   }
//   if (overrides.name) {
//     options.name = overrides.name
//   }
//   if (overrides.quiet && overrides.quiet !== 'false') {
//     options.log = false
//     options.warn = false
//   }

//   if (overrides.dynamicPublicPath) {
//     options.path = __webpack_public_path__ + options.path
//   }

//   if (overrides.ansiColors) options.ansiColors = JSON.parse(overrides.ansiColors)
//   if (overrides.overlayStyles) options.overlayStyles = JSON.parse(overrides.overlayStyles)

//   if (overrides.overlayWarnings) {
//     options.overlayWarnings = overrides.overlayWarnings == 'true'
//   }
// }

// function EventSourceWrapper() {
//   let source: any
//   let lastActivity = Date.now()
//   const listeners: any = []

//   init()
//   const timer = setInterval(function () {
//     const now = Date.now()
//     if (now - lastActivity > options.timeout) {
//       handleDisconnect()
//     }
//   }, options.timeout / 2)

//   function init() {
//     source = new window.EventSource(options.path)
//     source.onopen = handleOnline
//     source.onerror = handleDisconnect
//     source.onmessage = handleMessage
//   }

//   function handleOnline() {
//     if (options.log) console.log('[HMR] connected')
//     lastActivity = Date.now()
//   }

//   function handleMessage(event: any) {
//     lastActivity = Date.now()
//     for (let i = 0; i < listeners.length; i++) {
//       listeners[i](event)
//     }
//   }

//   function handleDisconnect() {
//     clearInterval(timer)
//     source.close()
//     setTimeout(init, options.timeout)
//   }

//   return {
//     addMessageListener: function (fn: any) {
//       listeners.push(fn)
//     },
//   }
// }

// function getEventSourceWrapper() {
//   if (!window.__whmEventSourceWrapper) {
//     window.__whmEventSourceWrapper = {}
//   }
//   if (!window.__whmEventSourceWrapper[options.path]) {
//     // cache the wrapper for other entries loaded on
//     // the same page with the same options.path
//     window.__whmEventSourceWrapper[options.path] = EventSourceWrapper()
//   }
//   return window.__whmEventSourceWrapper[options.path]
// }

// function connect() {
//   getEventSourceWrapper().addMessageListener(handleMessage)

//   function handleMessage(event: any) {
//     if (event.data == '\uD83D\uDC93') {
//       return
//     }
//     try {
//       processMessage(JSON.parse(event.data))
//     } catch (ex) {
//       if (options.warn) {
//         console.warn('Invalid HMR message: ' + event.data + '\n' + ex)
//       }
//     }
//   }
// }

// // the reporter needs to be a singleton on the page
// // in case the client is being used by multiple bundles
// // we only want to report once.
// // all the errors will go to all clients
// const singletonKey = '__webpack_hot_middleware_reporter__'
// let reporter: any
// if (typeof window !== 'undefined') {
//   if (!window[singletonKey]) {
//     window[singletonKey] = createReporter()
//   }
//   reporter = window[singletonKey]
// }

// function createReporter() {
//   // const strip = require('strip-ansi')

//   let overlay: any
//   if (typeof document !== 'undefined' && options.overlay) {
//     overlay = clientOverlay({
//       ansiColors: options.ansiColors,
//       overlayStyles: options.overlayStyles,
//     })
//   }

//   const styles: any = {
//     errors: 'color: #ff0000;',
//     warnings: 'color: #999933;',
//   }
//   let previousProblems: any = null
//   function log(type: any, obj: any) {
//     const newProblems = obj[type]
//       .map(function (msg: any) {
//         return strip(msg)
//       })
//       .join('\n')
//     if (previousProblems == newProblems) {
//       return
//     } else {
//       previousProblems = newProblems
//     }

//     const style = styles[type]
//     const name = obj.name ? "'" + obj.name + "' " : ''
//     const title = '[HMR] bundle ' + name + 'has ' + obj[type].length + ' ' + type
//     // NOTE: console.warn or console.error will print the stack trace
//     // which isn't helpful here, so using console.log to escape it.
//     if (console.group && console.groupEnd) {
//       console.group('%c' + title, style)
//       console.log('%c' + newProblems, style)
//       console.groupEnd()
//     } else {
//       console.log(
//         '%c' + title + '\n\t%c' + newProblems.replace(/\n/g, '\n\t'),
//         style + 'font-weight: bold;',
//         style + 'font-weight: normal;',
//       )
//     }
//   }

//   return {
//     cleanProblemsCache: function () {
//       previousProblems = null
//     },
//     problems: function (type: any, obj: any) {
//       if (options.warn) {
//         log(type, obj)
//       }
//       if (overlay) {
//         if (options.overlayWarnings || type === 'errors') {
//           overlay.showProblems(type, obj[type])
//           return false
//         }
//         overlay.clear()
//       }
//       return true
//     },
//     success: function () {
//       if (overlay) overlay.clear()
//     },
//     useCustomOverlay: function (customOverlay: any) {
//       overlay = customOverlay
//     },
//   }
// }

// let customHandler: any
// let subscribeAllHandler: any
// function processMessage(obj: any) {
//   switch (obj.action) {
//     case 'building':
//       if (options.log) {
//         console.log('[HMR] bundle ' + (obj.name ? "'" + obj.name + "' " : '') + 'rebuilding')
//       }
//       break
//     case 'built':
//       if (options.log) {
//         console.log('[HMR] bundle ' + (obj.name ? "'" + obj.name + "' " : '') + 'rebuilt in ' + obj.time + 'ms')
//       }
//     // fall through
//     case 'sync':
//       if (obj.name && options.name && obj.name !== options.name) {
//         return
//       }
//       let applyUpdate = true
//       if (obj.errors.length > 0) {
//         if (reporter) reporter.problems('errors', obj)
//         applyUpdate = false
//       } else if (obj.warnings.length > 0) {
//         if (reporter) {
//           const overlayShown = reporter.problems('warnings', obj)
//           applyUpdate = overlayShown
//         }
//       } else {
//         if (reporter) {
//           reporter.cleanProblemsCache()
//           reporter.success()
//         }
//       }
//       if (applyUpdate) {
//         processUpdate(obj.hash, obj.modules, options)
//       }
//       break
//     default:
//       if (customHandler) {
//         customHandler(obj)
//       }
//   }

//   if (subscribeAllHandler) {
//     subscribeAllHandler(obj)
//   }
// }
// let ep: any = {}
// if (module) {
//   ep = {
//     subscribeAll: function subscribeAll(handler: any) {
//       subscribeAllHandler = handler
//     },
//     subscribe: function subscribe(handler: any) {
//       customHandler = handler
//     },
//     useCustomOverlay: function useCustomOverlay(customOverlay: any) {
//       if (reporter) reporter.useCustomOverlay(customOverlay)
//     },
//     setOptionsAndConnect: setOptionsAndConnect,
//   }
// }
// export default ep
