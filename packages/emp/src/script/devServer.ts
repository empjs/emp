import Paths from 'src/helper/paths'
import {webpack} from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import logger from 'src/helper/logger'
class devServer {
  private paths: Paths
  constructor(paths: Paths) {
    this.paths = paths
    this.setup()
  }
  async setup() {
    const compiler = webpack({})
    const server = new WebpackDevServer({}, compiler)
    server.start()
  }
}
export default devServer
