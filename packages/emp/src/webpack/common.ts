import path from 'path'
import store from 'src/helper/store'
import wpChain from 'src/helper/wpChain'
import {Configuration} from 'webpack'
console.log(store.empResolve('node_modules'))
export const wpCommon = () => {
  const isDev = store.wpEnv === 'development'
  const config: Configuration = {
    resolve: {
      modules: [store.resolve('src'), 'node_modules'],
      alias: {
        src: store.appSrc,
      },
      extensions: store.extensions,
    },
    entry: {
      index: [path.resolve(store.appSrc, 'index.ts')],
    },
    experiments: {
      // outputModule: true,
      topLevelAwait: true,
      // buildHttp: {allowedUris: []},//影响热更
      backCompat: true,
    },
    output: {
      // module: true,
      // iife: false,
      // scriptType: 'module',
      // module: true,
      // libraryTarget: 'module',
      // library: {
      //   // name: 'index',
      //   // type: 'module',
      //   // type: 'umd',
      // },
      clean: store.config.build.emptyOutDir && !isDev, //替代 clean-webpack-plugin
      ...store.wpPaths.output,
    },
    stats: {
      errorDetails: true,
    },
  }
  wpChain.merge(config)
}
