import gls from 'src/helper/globalVars'
import wpChain from 'src/helper/wpChain'
import {Configuration} from 'webpack'
export const wpDevelopment = () => {
  const config: Configuration = {
    optimization: {
      usedExports: true, //Tells webpack to determine used exports for each module
    },
    devtool: 'eval-cheap-module-source-map',
    devServer: {
      bonjour: true,
      port: 8000,
      historyApiFallback: true,
      //   open,
      //   hot: hot === true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      static: [
        {
          directory: gls.config.base,
          publicPath: '/',
        },
        {
          directory: gls.outDir,
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
      },
    },
  }
  wpChain.merge(config)
}
