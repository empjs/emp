import globalVars from 'src/helper/globalVars'
import {wpCommon} from './common'
import {wpDevelopment} from './development'
import {wpFile} from './file'
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
    if (globalVars.wpEnv === 'development') {
      wpDevelopment()
    } else if (globalVars.wpEnv === 'production') {
      wpProduction()
    }
  }
}

export default WPConfig
