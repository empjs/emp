const {setPaths, getPaths} = require('../helpers/paths')
const {getProjectConfig} = require('../helpers/project')
const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const chalk = require('chalk')
const openBrowser = require('../helpers/openBrowser')
const prepareURLs = require('../helpers/prepareURLs')
// const downloadRemoteFile = require('../helpers/downloadRemoteFile')
// const {getHostname, getDevHost} = require('../helpers/serveTool')
module.exports = async args => {
  const {src, public, open, remote} = args
  await setPaths({src, public})
  const paths = getPaths()
  const {webpackConfig: config, empConfig} = await getProjectConfig('development', args, paths)
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
  config.devServer = {allowedHosts: 'all', ...config.devServer}
  const server = new WebpackDevServer(compiler, config.devServer)
  // const host = getDevHost(config.devServer.host)

  const {https, host, port, publicPath} = config.devServer
  const protocol = https ? 'https' : 'http'
  const realHost = host || '0.0.0.0'
  const urls = prepareURLs(protocol, realHost, port, publicPath)

  server.listen(config.devServer.port, realHost, err => {
    if (err) {
      console.error(err)
      return
    }

    compiler.hooks.done.tap('emp-cli dev', stats => {
      console.log()
      console.log()
      console.log(`  App running at:`)
      console.log(`  - Local:   ${chalk.cyan(urls.localUrlForTerminal)}`)
      console.log(`  - Network: ${chalk.cyan(urls.lanUrlForTerminal)}`)
      console.log()
    })

    // if (open === true) {
    //   let url = realHost
    //   if (config.devServer.port != 80) url += ':' + config.devServer.port
    //   openBrowser(`${protocol}://${url}`)
    //   console.log(`Starting server on ${protocol}://${host}:${config.devServer.port}`)
    // }
  })
}
