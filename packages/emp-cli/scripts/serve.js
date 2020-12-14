const {resolveApp, cachePaths} = require('../helpers/paths')
// const {getProjectConfig} = require('../helpers/project')
//
const fs = require('fs-extra')
const https = require('https')
const path = require('path')
const express = require('express')
const compression = require('compression')
let config = {}

config = require('../webpack/config/devServer')
config = config('production', {hot: false, open: false, progress: false})

if (fs.existsSync(cachePaths.buildConfig)) {
  const buildConfig = require(cachePaths.buildConfig)
  config = {...config, buildConfig}
}

// console.log('config json', config)
//
express.static.mime.types['ts'] = 'application/javascript'
//
const app = express()
app.use(compression())

module.exports = async args => {
  const {dist} = args
  // await setPaths({dist})
  //   const pathsDir = getPaths()
  // const config = await getProjectConfig('production', args)
  const staticRoot = resolveApp(dist || 'dist')
  const isHTTPS = !!config.devServer.https
  const protocol = isHTTPS ? 'https' : 'http'
  const html = await fs.readFile(path.join(staticRoot, 'index.html'), 'utf8')

  app.use(express.static(staticRoot))
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
