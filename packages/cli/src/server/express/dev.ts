// import RspackDevServer from 'webpack-dev-server'
import {RspackDevServer} from '@rspack/dev-server'
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
    return rspackConfig
  }
}
