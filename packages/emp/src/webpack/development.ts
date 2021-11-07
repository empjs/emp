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
    // devtool: 'eval-cheap-module-source-map',
    devtool: 'inline-source-map',
    devServer: {
      // bonjour: true,
      port,
      historyApiFallback: true,
      // host,
      compress: true,
      // open,
      // hot: true,
      // liveReload: true,
      /* headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      }, */
      static: globalVars.publicDir,
      /* static: [
        {
          directory: globalVars.publicDir,
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
      ], */
      /* client: {
        overlay: true,
        // progress: true,
      }, */
    },
  }
  wpChain.merge(config)
}
