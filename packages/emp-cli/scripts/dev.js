const {setPaths} = require('../helpers/paths')
const {getProjectConfig} = require('../helpers/project')
const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const openBrowser = require('react-dev-utils/openBrowser')

module.exports = async args => {
  const {src, public, open} = args
  await setPaths({src, public})
  const config = await getProjectConfig('development', args)
  //::Fix 新版本需要加入一下配置 支持 liveReload 和 hot reload
  WebpackDevServer.addDevServerEntrypoints(config, config.devServer)
  //
  const compiler = Webpack(config)
  const server = new WebpackDevServer(compiler, config.devServer)
  const host = config.devServer.host || 'localhost'
  server.listen(config.devServer.port, host, err => {
    if (err) {
      console.error(err)
      return
    }
    if (open === true) {
      let url = host
      if (config.devServer.port != 80) url += ':' + config.devServer.port
      const protocol = config.devServer.https ? 'https' : 'http'
      openBrowser(`${protocol}://${url}`)
      console.log(`Starting server on http://${host}:${config.devServer.port}`)
    }
  })
}
