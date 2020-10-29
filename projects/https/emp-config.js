const fs = require('fs')
// const path = require('path')

module.exports = ({config}) => {
  // config.devServer.host('dev.com')
  // config.devServer.https({
  //   key: fs.readFileSync('cert/webZoneSha2Crt.key'),
  //   cert: fs.readFileSync('cert/webZoneSha2Crt.crt'),
  // })
  config.devServer.host('localhost')
  config.devServer.https(true)
}
