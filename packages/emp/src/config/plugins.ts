import store from 'src/helper/store'
import wpChain, {WPChain} from 'src/helper/wpChain'

import {ResovleConfig} from 'src/config'
export type ConfigPluginOptions = {
  wpChain: WPChain
  config: ResovleConfig
}
export type ConfigPluginType = (o: ConfigPluginOptions) => void | Promise<void>
class ConfigPlugins {
  constructor() {}
  async setup() {
    if (store.config.plugins.length > 0) {
      // 并行执行所有插件方法
      await Promise.all(
        store.config.plugins.map(async (fn: ConfigPluginType) => {
          if (fn) await fn({wpChain: wpChain, config: store.config})
        }),
      )
    }
  }
}
export default new ConfigPlugins()
