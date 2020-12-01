const open = require('open')

const openBrowser = function (url) {
  try {
    open(url).catch(() => {})
    return true
  } catch (err) {
    return false
  }
}

module.exports = {openBrowser}
