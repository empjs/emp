const http = require('http')

const portInUsed = function ({host, port}) {
  return new Promise(function (resolve, reject) {
    const server = http.createServer().listen({host, port})
    server.on('listening', function () {
      server.close()
      resolve(false)
    })
    server.on('error', function (err) {
      err.code == 'EADDRINUSE' ? resolve(true) : reject(err)
    })
  })
}

module.exports = {portInUsed}
