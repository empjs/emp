import WPChain from 'webpack-chain'
import globalVars from './globalVars'
import fs from 'fs-extra'
import logger from './logger'

const wpChain = new WPChain()
export const getConfig = () => {
  const conf = wpChain.toConfig()
  const {wplogger} = globalVars.cliOptions
  if (wplogger) {
    if (typeof wplogger === 'string') {
      fs.writeFile(globalVars.resolve(wplogger), `module.exports=${JSON.stringify(conf, null, 2)}`).catch(e =>
        logger.error(e),
      )
    } else {
      logger.info('=== webpack config ===', JSON.stringify(conf, null, 2))
    }
  }
  return conf
}
export default wpChain
