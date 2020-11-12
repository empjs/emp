const {setPaths, getPaths} = require('../helpers/paths')
const {getProjectConfig} = require('../helpers/project')
//
const fs = require('fs-extra')
const https = require('https')
const path = require('path')
const express = require('express')
const compression = require('compression')
//
express.static.mime.types['ts'] = 'application/javascript'
//
const app = express()
app.use(compression())

module.exports = async args => {
  const {dist} = args
  await setPaths({dist})
  const config = await getProjectConfig('production', args)
  const isHTTPS = !!config.devServer.https
  const protocol = isHTTPS ? 'https' : 'http'
  const pathsDir = getPaths()
  const html = await fs.readFile(path.join(pathsDir.dist, 'index.html'), 'utf8')

  app.use(express.static(pathsDir.dist))
  app.get('*', (req, res) => res.send(html))
  //
  if (isHTTPS && config.devServer.https.key && config.devServer.https.cert) {
    const httpsServer = https.createServer({key: config.devServer.https.key, cert: config.devServer.https.cert}, app)
    httpsServer.listen(config.devServer.port, () =>
      console.log(
        `EMP APP listening at ${protocol}://${config.devServer.host || 'localhost'}:${config.devServer.port}`,
      ),
    )
  } else {
    app.listen(config.devServer.port, () =>
      console.log(
        `EMP APP listening at ${protocol}://${config.devServer.host || 'localhost'}:${config.devServer.port}`,
      ),
    )
  }
}
