import store from 'src/helper/store'
import wpChain from 'src/helper/wpChain'
import {Configuration} from 'webpack'
export const wpDevelopment = () => {
  const {hot, open, port, host} = store.config.server
  const config: Configuration = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      port,
      host,
      open,
      hot,
      historyApiFallback: true,
      // compress: true,
      static: store.publicDir,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
    },
  }
  wpChain.merge(config)
}
