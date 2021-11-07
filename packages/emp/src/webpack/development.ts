import globalVars from 'src/helper/globalVars'
import wpChain from 'src/helper/wpChain'
import {Configuration} from 'webpack'
export const wpDevelopment = () => {
  const {hot, open, port, host} = globalVars.config.server
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
      static: globalVars.publicDir,
    },
  }
  wpChain.merge(config)
}
