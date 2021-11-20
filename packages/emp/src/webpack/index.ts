import store from 'src/helper/store'
import WPCommon from './common'
import WPDevelopment from './development'
import WPFile from './file'
import WPCss from './css'
import WPModule from './module'
import WPPlugin from './plugin'
import WPProduction from './production'
import WPEntries from './entries'
class WPConfig {
  entries = new WPEntries()
  css = new WPCss()
  common = new WPCommon()
  module = new WPModule()
  plugin = new WPPlugin()
  file = new WPFile()
  development = new WPDevelopment()
  production = new WPProduction()
  constructor() {}
  async setup() {
    await Promise.all([
      this.entries.setup(),
      this.common.setup(),
      this.module.setup(),
      this.plugin.setup(),
      this.file.setup(),
      this.css.setup(),
    ])
    if (store.config.mode === 'development') await this.development.setup()
    else if (store.config.mode === 'production') await this.production.setup()
  }
}

export default WPConfig
