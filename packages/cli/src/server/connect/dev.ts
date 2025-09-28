// import RspackDevServer from 'webpack-dev-server'
import {RspackDevServer} from '@rspack/dev-server'
import connect from 'connect'
import logger from 'src/helper/logger'
import type {Compiler, GlobalStore, RspackOptions} from 'src/index'
import type {DevServerType} from 'src/server/types'

export class DevServer implements DevServerType {
  private server: any = null

  async setup(compiler: Compiler, rspackConfig: RspackOptions, store: GlobalStore, onReady: any = () => {}) {
    if (!rspackConfig.devServer) return logger.warn('rspackConfig.devServer need!')
    const app = new RspackDevServer(rspackConfig.devServer, compiler)
    await app.start()
    app.middleware?.waitUntilValid(onReady)
    this.server = app
    return app
  }

  async beforeCompiler(rspackConfig: any) {
    rspackConfig.devServer.app = () => connect()
    if (rspackConfig.devServer.server && rspackConfig.devServer.server.type === 'https') {
      rspackConfig.devServer.server.type = 'http2'
    }
    // console.log('rspackConfig', rspackConfig.devServer)
    return rspackConfig
  }

  async close() {
    logger.debug('close dev server')
    if (this.server) {
      try {
        await this.server.stop()
        this.server = null
        return true
      } catch (error) {
        logger.error('Error closing dev server:', error)
        return false
      }
    }
    return true
  }
}
