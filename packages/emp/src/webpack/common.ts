import path from 'path'
import globalVars from 'src/helper/globalVars'
import wpChain from 'src/helper/wpChain'
import {Configuration} from 'webpack'
console.log(globalVars.empResolve('node_modules'))
export const wpCommon = () => {
  const isDev = globalVars.wpEnv === 'development'
  const config: Configuration = {
    mode: globalVars.wpEnv,
    watch: !!globalVars.cliOptions.watch,
    // watchOptions: {
    //   ignored: ['**/.git/**', '**/node_modules/**', '**/dist/**'],
    // },

    /*  cache: {
      type: 'filesystem',
      allowCollectingMemory: true,
    }, */
    resolve: {
      modules: [globalVars.resolve('src'), 'node_modules'],
      alias: {
        src: globalVars.appSrc,
      },
      extensions: globalVars.extensions,
    },
    entry: {
      index: [
        // globalVars.empResolve('node_modules/webpack/hot/dev-server.js'),
        // Dev server client for web socket transport, hot and live reload logic
        // globalVars.empResolve('node_modules/webpack-dev-server/client/index.js?hot=true&live-reload=true'),
        path.resolve(globalVars.appSrc, 'index.js'),
      ],
    },
    experiments: {
      // outputModule: true,
      topLevelAwait: true,
      buildHttp: {allowedUris: []},
      backCompat: true,
    },
    output: {
      // module: true,
      // libraryTarget: 'module',
      clean: globalVars.config.build.emptyOutDir && !isDev, //替代 clean-webpack-plugin
      // library: {
      //   // name: 'index',
      //   // type: 'module',
      //   // type: 'umd',
      // },
      ...globalVars.wpPaths.output,
    },

    plugins: [],
    optimization: {
      chunkIds: 'named',
      minimize: globalVars.config.build.minify && !isDev,
      // runtimeChunk: 'single',
    },
    stats: {
      // all: true,
      errorDetails: true,
    },
  }
  wpChain.merge(config)
}
