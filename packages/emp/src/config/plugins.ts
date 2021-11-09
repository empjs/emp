import store from 'src/helper/store'
import wpChain, {WPChain} from 'src/helper/wpChain'

import {ResovleConfig} from 'src/config'
export type ConfigPluginType = (wpChain: WPChain, config: ResovleConfig) => void | Promise<void>
class ConfigPlugins {
  constructor() {}
  async setup() {
    if (store.config.plugins.length > 0) {
      await Promise.all(
        store.config.plugins.map(async (fn: ConfigPluginType) => {
          if (fn) await fn(wpChain, store.config)
        }),
      )
    }
  }
}
export default ConfigPlugins
