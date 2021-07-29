const env = 'debug'
module.exports = {
  measure(t, fn) {
    if (env === 'debug') {
      console.time(t)
      const cb = fn()
      console.timeEnd(t)
      return cb
    }
    return fn()
  },
}
