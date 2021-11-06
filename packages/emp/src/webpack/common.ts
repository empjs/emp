import path from 'path'
import globalVars from 'src/helper/globalVars'
import gls from 'src/helper/globalVars'
import wpChain from 'src/helper/wpChain'
import {Configuration} from 'webpack'
export const wpCommon = () => {
  const config: Configuration = {
    // target: 'web',
    mode: gls.wpEnv,
    watchOptions: {
      ignored: ['**/.git/**', '**/node_modules/**', '**/dist/**'],
    },

    /*  cache: {
      type: 'filesystem',
      allowCollectingMemory: true,
    }, */
    cache: false,
    resolve: {
      modules: [gls.resolve('node_modules'), gls.resolve('src'), 'node_modules'],
      alias: {
        src: gls.appSrc,
      },
      extensions: gls.extensions,
    },
    entry: {
      index: path.resolve(gls.appSrc, 'index.ts'),
    },
    experiments: {
      outputModule: true,
      topLevelAwait: true,
      buildHttp: {allowedUris: []},
    },
    output: {
      module: true,
      // libraryTarget: 'module',
      clean: gls.config.build.emptyOutDir, //替代 clean-webpack-plugin
      // library: {
      //   // name: 'index',
      //   // type: 'module',
      //   // type: 'umd',
      // },
      ...gls.wpPaths.output,
    },

    plugins: [],
    optimization: {
      chunkIds: 'named',
      minimize: globalVars.config.build.minify,
      runtimeChunk: 'single',
    },
    stats: {
      // all: true,
      errorDetails: true,
    },
  }
  wpChain.merge(config)
}
