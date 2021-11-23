import store from 'src/helper/store'
import wpChain from 'src/helper/wpChain'
import {Configuration} from 'webpack'
class WPDevelopment {
  constructor() {}
  async setup() {
    const config: Configuration = {
      mode: 'development',
      devtool: 'inline-source-map',
      devServer: {
        allowedHosts: ['all'],
        historyApiFallback: true,
        // compress: true,
        static: store.publicDir,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        },
        ...(store.config.server as Configuration['devServer']),
      },
    }
    wpChain.merge(config)
  }
}
export default WPDevelopment
