const {setPaths, getPaths} = require('../helpers/paths')
const {getProjectConfig} = require('../helpers/project')
const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const chalk = require('chalk')
// const ora = require('ora')
const {logger, logTag} = require('../helpers/logger.js')
// const openBrowser = require('../helpers/openBrowser')
const prepareURLs = require('../helpers/prepareURLs')

// const downloadRemoteFile = require('../helpers/downloadRemoteFile')
// const {getHostname, getDevHost} = require('../helpers/serveTool')
module.exports = async args => {
  logTag(`dev server running at:`)
  // const spinner = ora('Loading...\n').start()
  //
  const {src, public, open, remote} = args
  await setPaths({src, public})
  const paths = getPaths()
  // console.time('getProjectConfig')
  const {webpackConfig: config, empConfig} = await getProjectConfig('development', args, paths)
  // console.timeEnd('getProjectConfig')
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
  const server = new WebpackDevServer(config.devServer, compiler)
  // const host = getDevHost(config.devServer.host)
  const runServer = async () => {
    await server.start()
    // spinner.succeed('server success.')
  }

  runServer()
  /*   const {https, host, port, publicPath} = config.devServer
  const protocol = https ? 'https' : 'http'
  const realHost = host || '0.0.0.0'
  const urls = prepareURLs(protocol, realHost, port, publicPath)

  server.start(config.devServer.port, realHost, err => {
    if (err) {
      logger.error(err)
      spinner.err('server fail.')
      return
    }
    spinner.succeed('server success.')
    compiler.hooks.done.tap('emp-cli dev', stats => {
      logger.info(`\n  App running at:`)
      logger.info(`  - Local:   ${chalk.cyan(urls.localUrlForTerminal)}`)
      logger.info(`  - Network: ${chalk.cyan(urls.lanUrlForTerminal)} \n`)
    })
  }) */
}
