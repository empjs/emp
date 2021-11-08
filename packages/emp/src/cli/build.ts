import {webpack} from 'webpack'
import {getConfig} from 'src/helper/wpChain'
import store from 'src/helper/store'
import logger, {logTitle} from 'src/helper/logger'
class Build {
  constructor() {}
  async setup() {
    logTitle(`build for production:`)
    const config = getConfig()
    webpack(config, (err: any, stats: any) => {
      if (err) {
        logger.error(err.stack || err)
        if (err.details) {
          logger.error(err.details)
        }
        return
      }

      const info = stats.toJson()

      if (stats.hasErrors()) {
        logger.error(info.errors)
        return
      }

      if (stats.hasWarnings()) {
        logger.warn(info.warnings)
      }

      logger.info(stats.toString(store.wpo.stats))
    })
  }
}
export default new Build()
