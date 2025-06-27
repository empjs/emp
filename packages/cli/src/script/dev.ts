import {type RspackOptions, rspack} from '@rspack/core'
import {timeDone} from 'src/helper/buildPrint'
import {deepAssign} from 'src/helper/utils'
import {BaseScript} from 'src/script/base'
import {DevServer} from 'src/server'
import store, {type GlobalStore} from 'src/store'

const empDevServer = new DevServer()
class DevScript extends BaseScript {
  get stats() {
    return {
      all: store.empConfig.debug.devShowAllLog,
      // all: true,
      colors: true,
      assets: false,
      chunks: false,
      entrypoints: false,
      timings: false,
      version: false,
      errors: true,
      warnings: true,
    }
  }
  private async getRspackDevConfig() {
    const cf: RspackOptions = deepAssign(store.rsConfig, {
      stats: this.stats,
      devServer: {
        open: false, //避免 打开多tab!!!
        setupExitSignals: true,
        port: store.server.port,
      },
    })
    const {devServer}: any = cf
    if (store.server.isHttps) {
      /**
       * 弃置options
       */
      if (!devServer.server || (devServer.server.type === 'https' && !devServer.server.options)) {
        const {key, cert} = await store.server.getcert()
        devServer.server = {
          type: 'https',
          options: {
            key,
            cert,
          },
        }
      }
    }
    //
    if (Object.hasOwn(devServer, 'https')) {
      delete devServer.https
    }
    return cf
  }
  override async run() {
    const {server} = store
    let rspackConfig = await this.getRspackDevConfig()
    rspackConfig = await empDevServer.beforeCompiler(rspackConfig)
    //
    const compiler = rspack(rspackConfig)
    await store.empConfig.lifeCycle.beforeDevServe()
    server.startOpen()
    await empDevServer.setup(compiler, rspackConfig, store as GlobalStore, async (o: any) => {
      this.showTimeDone(o)
      await store.empConfig.lifeCycle.afterDevServe()
    })
    if (store.debug.showPerformance) {
      compiler.hooks.afterDone.tap('done', this.showTimeDone)
    }
  }
  private showTimeDone = (s: any) => {
    const d = s?.toJson({all: false, colors: false, assets: false, chunks: false, timings: true})
    timeDone(d.time)
  }
}
export default new DevScript()
