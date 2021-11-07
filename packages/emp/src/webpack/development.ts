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
      compress: true,
      static: store.publicDir,
    },
  }
  wpChain.merge(config)
}
