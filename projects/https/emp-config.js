const fs = require('fs')
// const path = require('path')

module.exports = ({config}) => {
  // config.devServer.host('dev.com')
  // config.devServer.https({
  //   key: fs.readFileSync('key'),
  //   cert: fs.readFileSync('crt'),
  // })
  config.devServer.host('localhost')
  config.devServer.https(true)
}
