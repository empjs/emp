import type {ConfigPluginOptions} from '@efox/emp'
import TestPlugin from './plugin'
import {PolyfillOption} from './plugin'

const plugin = (polyfill: PolyfillOption[]) => {
  return async ({wpChain}: ConfigPluginOptions) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (polyfill) {
      wpChain.plugin('polyfill-plugin').use(TestPlugin, [{polyfill}])
    }
  }
}

export default plugin
module.exports = plugin
