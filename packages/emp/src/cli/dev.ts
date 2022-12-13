import {webpack} from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import {getConfig} from 'src/helper/wpChain'
import {logTag} from 'src/helper/logger'
import {clearConsole} from 'src/helper/utils'
import store from 'src/helper/store'
import {getPorts} from './getPort'
class devServer {
  server?: WebpackDevServer
  constructor() {}
  async setup() {
    await this.setServer()
    this.setProcess()
  }
  async setServer() {
    const config = getConfig()
    if (store.config.debug.clearLog) clearConsole()
    logTag(
      `dev server running - ${store.config.compile.compileType} compile`,
      store.config.compile.compileType !== 'babel' ? 'orange' : 'blue',
    )
    // if (store.config.compile.compileType !== 'babel') logTag(`use ${store.config.compile.compileType}`, 'purple')
    //
    const port = await getPorts(Number(config.devServer?.port) || 8000, config.devServer?.host || '0.0.0.0')
    const compiler = webpack(config)
    this.server = new WebpackDevServer({...config.devServer, ...{port}}, compiler)
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
