import {timeDone} from 'src/helper/buildPrint'
import {BaseScript} from 'src/script/base'
import {ProdServer} from 'src/server'
import store from 'src/store'

const server = new ProdServer()
let timing = 0
export class ServeScript extends BaseScript {
  override async run() {
    timing = Date.now()
    await store.empConfig.lifeCycle.beforeServe()
    await server.setup(store, this.onReady)
  }
  onReady = async () => {
    store.server.startOpen()
    timeDone(Date.now() - timing, 'Server Started')
    await store.empConfig.lifeCycle.afterServe()
  }
}
export default new ServeScript()
