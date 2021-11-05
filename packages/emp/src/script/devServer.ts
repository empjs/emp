import {webpack} from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import {getConfig} from 'src/helper/wpChain'
class devServer {
  constructor() {
    this.setup()
  }
  async setup() {
    const config = getConfig()
    const compiler = webpack(config)
    const server = new WebpackDevServer(config.devServer || {}, compiler)
    server.start()
  }
}
export default devServer
