import type {ConfigPluginOptions} from '@efox/emp'
import TestPlugin from './plugin'
import {PolyfillOption} from './plugin'

const plugin = (polyfill: PolyfillOption[]) => {
  return async ({wpChain, config}: ConfigPluginOptions) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (polyfill) {
      wpChain.plugin('polyfill-plugin').use(TestPlugin, [{polyfill, publicPath: config.base}])
    }
  }
}

export default plugin
module.exports = plugin
