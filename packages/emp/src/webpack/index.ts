import globalVars from 'src/helper/globalVars'
import {wpCommon} from './common'
import {wpDevelopment} from './development'
import {wpProduction} from './production'
class WPConfig {
  constructor() {}
  async setup() {
    wpCommon()
    if (globalVars.wpEnv === 'development') {
      wpDevelopment()
    } else if (globalVars.wpEnv === 'production') {
      wpProduction()
    }
  }
}

export default WPConfig
