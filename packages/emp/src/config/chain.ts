import store from 'src/helper/store'
import wpChain, {WPChain} from 'src/helper/wpChain'
import {ResovleConfig} from 'src/config'

export type WebpackChainType = (chain: WPChain, config: ResovleConfig) => void | Promise<void>
class chainConfig {
  constructor() {}
  async setup(): Promise<void> {
    if (store.config.webpackChain) {
      if (typeof store.config.webpackChain === 'function') {
        await store.config.webpackChain(wpChain, store.config)
      }
    }
  }
}
export default new chainConfig()
