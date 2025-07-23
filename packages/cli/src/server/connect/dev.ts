// import RspackDevServer from 'webpack-dev-server'
import {RspackDevServer} from '@rspack/dev-server'
import connect from 'connect'
import type {Compiler, GlobalStore, RspackOptions} from 'src/index'
import type {DevServerType} from 'src/server/types'

export class DevServer implements DevServerType {
  async setup(compiler: Compiler, rspackConfig: RspackOptions, store: GlobalStore, onReady: any = () => {}) {
    if (!rspackConfig.devServer) return console.warn('rspackConfig.devServer need!')
    const app = new RspackDevServer(rspackConfig.devServer, compiler)
    await app.start()
    app.middleware?.waitUntilValid(onReady)
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
}
