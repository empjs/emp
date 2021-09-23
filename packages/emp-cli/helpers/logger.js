const {Logger} = require('tslog')
// const consola = require('consola')
const env = 'debug'

/* let logger = consola.create({
  level: env === 'debug' ? 5 : 3,
  reporters: [new consola.FancyReporter()],
  defaults: {
    tag: 'EMP',
    additionalColor: 'white',
  },
}) */

logger = new Logger({
  name: 'EMP',
  minLevel: env === 'debug' ? 0 : 3,
  displayDateTime: false,
  displayFunctionName: false,
})

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
