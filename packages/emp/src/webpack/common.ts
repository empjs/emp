import path from 'path'
import store from 'src/helper/store'
import wpChain from 'src/helper/wpChain'
import {Configuration} from 'webpack'
export const wpCommon = () => {
  const isDev = store.wpo.mode === 'development'
  const isESM = store.isESM
  const config: Configuration = {
    /* cache: {
      type: 'filesystem',
      cacheDirectory: store.cacheDir,
    }, */
    resolve: store.wpo.resolve,
    entry: store.wpo.entry,
    // externalsType: 'script',
    externals: store.wpo.external,
    experiments: {
      outputModule: isESM,
      topLevelAwait: true,
      // buildHttp: {allowedUris: []},//影响热更
      backCompat: true,
    },
    // externalsType: 'module',
    // target: store.config.build.target,
    output: {
      //TODO: Library 模式的处理
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
      ...store.wpo.output,
    },
    stats: store.wpo.stats,
  }
  if (isESM) {
    config.externalsType = 'module'
    // config.externalsType = 'import'
  }
  wpChain.merge(config)
}
