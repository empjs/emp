import WPModule from './module'
import WPPlugin from './plugin'
import WPCommon from './common'
import {buildLibType} from 'src/types'
import store from 'src/helper/store'
class WPLibMode {
  common = new WPCommon()
  module = new WPModule()
  plugin = new WPPlugin()
  constructor() {}
  async setup() {}
  async libTarget(format: buildLibType) {
    if (format === 'esm') store.isESM = true
    await Promise.all([this.common.setup(), this.module.setup(), this.plugin.setup()])
  }
}

export default new WPLibMode()
