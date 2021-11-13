import store from 'src/helper/store'
import wpChain, {WPChain} from 'src/helper/wpChain'

export type WebpackChainType = (chain: WPChain, o: typeof store) => void | Promise<void>
class chainConfig {
  constructor() {}
  async setup(): Promise<void> {
    if (store.config.webpackChain) {
      if (typeof store.config.webpackChain === 'function') {
        await store.config.webpackChain(wpChain, store)
      }
    }
  }
}
export default new chainConfig()
