import globalVars from 'src/helper/globalVars'
import wpChain from 'src/helper/wpChain'
import {Configuration} from 'webpack'
export const wpDevelopment = () => {
  const {hot, open, port, host} = globalVars.config.server
  const config: Configuration = {
    optimization: {
      // usedExports: true, //Tells webpack to determine used exports for each module
    },
    // devtool: 'eval-source-map',//Recommended
    devtool: 'eval-cheap-module-source-map',
    devServer: {
      bonjour: true,
      port,
      historyApiFallback: true,
      host,
      open,
      hot: 'only',
      // liveReload: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      static: [
        {
          directory: globalVars.config.publicDir,
          publicPath: '/',
        },
        {
          directory: globalVars.outDir,
          publicPath: '/',
          staticOptions: {
            setHeaders: (res, path) => {
              if (path.toString().endsWith('.d.ts'))
                res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
            },
          },
        },
      ],
      client: {
        overlay: true,
        progress: true,
      },
    },
  }
  wpChain.merge(config)
}
