import store from 'src/helper/store'
import wpChain from 'src/helper/wpChain'
import {Configuration} from 'webpack'
class WPDevelopment {
  constructor() {}
  async setup() {
    const {devServer} = this
    const config: Configuration = {
      mode: 'development',
      devtool: 'inline-source-map',
      devServer,
    }
    wpChain.merge(config)
  }
  /**
   * dev server
   */
  get devServer(): Configuration['devServer'] {
    const overlayLoggerLv =
      store.config.debug.level === 'error' ? {errors: true, warnings: false} : {errors: true, warnings: true}
    const storeServer: any = store.config.server
    if (storeServer.https && !storeServer.http2) {
      if (typeof storeServer.https === 'boolean') {
        storeServer.server = 'https'
      } else {
        storeServer.server = {
          type: 'https',
          options: storeServer.https,
        }
      }
      delete storeServer.https
    } else if (storeServer.http2) {
      if (typeof storeServer.http2 === 'boolean') {
        storeServer.server = 'spdy'
      } else {
        storeServer.server = {
          type: 'spdy',
          options: storeServer.http2,
        }
      }
      delete storeServer.http2
    }
    // console.log('storeServer', storeServer)
    return {
      // host: '0.0.0.0',
      allowedHosts: ['all'],
      historyApiFallback: true,
      // compress: true,
      static: [
        store.publicDir,
        // 暴露 d.ts 文件
        {
          directory: store.outDir,
          publicPath: '/',
          staticOptions: {
            setHeaders: function (res: any, path) {
              if (path.toString().endsWith('.d.ts')) res?.set('Content-Type', 'application/javascript; charset=utf-8')
            },
          },
        },
      ],
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      client: {
        overlay: {
          ...overlayLoggerLv,
        },
      },
      ...storeServer,
    }
  }
}
export default WPDevelopment
