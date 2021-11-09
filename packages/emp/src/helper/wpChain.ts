import WPChain from 'webpack-chain'
import store from './store'
import fs from 'fs-extra'
import logger from './logger'
export {WPChain}
const wpChain = new WPChain()
export const getConfig: any = () => {
  const conf = wpChain.toConfig()
  const {wplogger} = store.cliOptions
  if (wplogger) {
    if (typeof wplogger === 'string') {
      fs.writeFile(store.resolve(wplogger), `module.exports=${JSON.stringify(conf, null, 2)}`).catch(e =>
        logger.error(e),
      )
    } else {
      logger.info('=== webpack config ===', JSON.stringify(conf, null, 2))
    }
  }
  return conf
}
export default wpChain
