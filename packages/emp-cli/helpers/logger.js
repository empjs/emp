// const Logger = require('js-logger')
const consola = require('consola')
const env = 'debug'

let logger = consola.create({
  level: env === 'debug' ? 5 : 3,
  reporters: [new consola.FancyReporter()],
  defaults: {
    tag: 'EMP',
    additionalColor: 'white',
  },
})

// logger = logger.withScope('EMP')

module.exports = {
  logger,
  measure(t, fn) {
    if (env === 'debug') {
      // logger.time(t)
      let time = Date.now()
      const cb = fn()
      // logger.timeEnd(t)
      time = `${t} ${Date.now() - time} ms`
      logger.debug(time)
      return cb
    }

    return fn()
  },
}
