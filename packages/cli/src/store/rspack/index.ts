import type {GlobalStore} from 'src/store'
import rspackCommon from 'src/store/rspack/common'
import rspackCss from 'src/store/rspack/css'
import rspackEntries from 'src/store/rspack/entries'
import rspackModule from 'src/store/rspack/module'
import rspackPlugin from 'src/store/rspack/plugin'
export class RspackStore {
  public store!: GlobalStore
  async setup(store: GlobalStore) {
    this.store = store
    // 初始化所有配置
    const runFuns = [
      rspackCommon.setup(this.store),
      rspackModule.setup(this.store),
      rspackPlugin.setup(this.store),
      rspackEntries.setup(this.store),
      rspackCss.setup(this.store),
    ]
    await Promise.all(runFuns)
    // 执行 [emp-config] 里面的 plugins 函数
    await this.store.empConfig.lifeCycle.beforeEmpPlugin()
    await this.store.empConfig.plugins()
    await this.store.empConfig.lifeCycle.afterEmpPlugin()
    // 执行 [emp-config] 里面的 chain 函数
    await this.store.empConfig.chain()
  }
}
export default new RspackStore()
