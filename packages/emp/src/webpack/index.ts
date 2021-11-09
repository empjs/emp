import store from 'src/helper/store'
import {wpCommon} from './common'
import {wpDevelopment} from './development'
import {wpFile} from './file'
import {wpCSS} from './css'
import {wpModule} from './module'
import {wpPlugin} from './plugin'
import {wpProduction} from './production'
class WPConfig {
  constructor() {}
  async setup() {
    wpCommon()
    wpModule()
    wpPlugin()
    wpFile()
    wpCSS(store.wpo.mode)
    if (store.wpo.mode === 'development') {
      wpDevelopment()
    } else if (store.wpo.mode === 'production') {
      wpProduction()
    }
  }
}

export default WPConfig
