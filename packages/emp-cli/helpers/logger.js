// const {Logger} = require('tslog') // const consola = require('consola')
const pkg = require('../package.json')
const chalk = require('chalk')
const env = 'prod'
/* let logger = consola.create({
  level: env === 'debug' ? 5 : 3,
  reporters: [new consola.FancyReporter()],
  defaults: {
    tag: 'EMP',
    additionalColor: 'white',
  },
}) */

const logger = {
  info: (...args) => console.log(...args),
  debug: (...args) => console.log(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
}

const logTagStyle = (msg, c1, c2, w = '#ecf0f1') =>
  console.log(`${chalk.bgHex(w).hex(c1)(` EMP v${pkg.version} `)}${chalk.hex(w).bgHex(c2)(` ${msg} `)}\n`)
const logTag = (msg, tag = 'blue') => {
  switch (tag) {
    case 'green':
      logTagStyle(msg, '#27ae60', '#2ecc71')
      break
    case 'blue':
      logTagStyle(msg, '#2980b9', '#3498db')

      break
    case 'red':
      logTagStyle(msg, '#c0392b', '#e74c3c')
      break
    case 'yellow':
      logTagStyle(msg, '#f39c12', '#f1c40f')
      break
  }
}

module.exports = {
  logger,
  logTag,
  measure(t, fn) {
    if (env === 'debug') {
      // logger.time(t)
      let time = Date.now()
      const cb = fn() // logger.timeEnd(t)

      time = `${t} ${Date.now() - time} ms`
      logger.debug(time)
      return cb
    }

    return fn()
  },
}
