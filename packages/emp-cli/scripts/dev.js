const {setPaths} = require('../helpers/paths')
const {getProjectConfig} = require('../helpers/project')
const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const openBrowser = require('../helpers/openBrowser')
// const downloadRemoteFile = require('../helpers/downloadRemoteFile')
const {getHostname, getDevHost} = require('../helpers/serveTool')
module.exports = async args => {
  const {src, public, open, remote} = args
  await setPaths({src, public})
  const {webpackConfig: config, empConfig} = await getProjectConfig('development', args)
  // before dev hook
  if (typeof empConfig.beforeDev === 'function') {
    await empConfig.beforeDev(config)
  }
  //::Fix 新版本需要加入一下配置 支持 liveReload 和 hot reload
  // WebpackDevServer.addDevServerEntrypoints(config, config.devServer)
  //
  // if (remote) {
  //   downloadRemoteFile()
  // }
  //
  const compiler = Webpack(config)
  const server = new WebpackDevServer(compiler, config.devServer)
  const host = getDevHost(config.devServer.host)
  server.listen(config.devServer.port, '0.0.0.0', err => {
    if (err) {
      console.error(err)
      return
    }
    if (open === true) {
      let url = host
      if (config.devServer.port != 80) url += ':' + config.devServer.port
      const protocol = config.devServer.https ? 'https' : 'http'
      openBrowser(`${protocol}://${url}`)
      console.log(`Starting server on ${protocol}://${host}:${config.devServer.port}`)
    }
  })
}
