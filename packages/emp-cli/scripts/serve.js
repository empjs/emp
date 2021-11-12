const {resolveApp, cachePaths} = require('../helpers/paths')
const fs = require('fs-extra')
const https = require('https')
const path = require('path')
const express = require('express')
const cors = require('cors')
const compression = require('compression')
const {logger, logTag} = require('../helpers/logger.js')
const prepareURLs = require('../helpers/prepareURLs')
const chalk = require('chalk')
let config = {}
config = require('../webpack/config/devServer')
config = config('production', {hot: false, open: false, progress: false})

if (fs.existsSync(cachePaths.buildConfig)) {
  const buildConfig = require(cachePaths.buildConfig)
  config = {...config, ...buildConfig}
}
express.static.mime.types['ts'] = 'application/javascript'
//
const app = express()
app.use(compression())
app.use(cors())

module.exports = async args => {
  logTag(`server running at:`)
  //
  const {dist} = args
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
    app.listen(config.devServer.port, () => {
      // console.log(`EMP APP listening at ${protocol}://${config.devServer.host || 'localhost'}:${config.devServer.port}`)
      const {https, host, port, publicPath} = config.devServer
      const protocol = https ? 'https' : 'http'
      const realHost = host || '0.0.0.0'
      const urls = prepareURLs(protocol, realHost, port, publicPath)
      logger.info(`- Local:   ${chalk.hex('#3498db')(urls.localUrlForTerminal)}`)
      logger.info(`- Network: ${chalk.hex('#3498db')(urls.lanUrlForTerminal)} \n`)
    })
  }
}
