import {webpack} from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import {getConfig} from 'src/helper/wpChain'
import {logTag} from 'src/helper/logger'
import {clearConsole} from 'src/helper/utils'
import store from 'src/helper/store'
class devServer {
  server?: WebpackDevServer
  constructor() {}
  async setup() {
    await this.setServer()
    this.setProcess()
  }
  async setServer() {
    if (!store.cliOptions.wplogger) clearConsole()
    logTag(`dev server running at:`)
    const config = getConfig()
    const compiler = webpack(config)
    this.server = new WebpackDevServer(config.devServer || {}, compiler)
    this.server.start()
    // this.server.startCallback(() => {})
  }
  setProcess() {
    const {server} = this
    const sigs = ['SIGINT', 'SIGTERM']
    sigs.forEach(function (sig) {
      process.on(sig, function () {
        server?.stop()
        process.exit()
      })
    })
    process.on('unhandledRejection', err => {
      throw err
    })
  }
}
export default new devServer()
