import path from 'path'
import globalVars from 'src/helper/globalVars'
import wpChain from 'src/helper/wpChain'
import {Configuration} from 'webpack'
console.log(globalVars.empResolve('node_modules'))
export const wpCommon = () => {
  const isDev = globalVars.wpEnv === 'development'
  const config: Configuration = {
    resolve: {
      modules: [globalVars.resolve('src'), 'node_modules'],
      alias: {
        src: globalVars.appSrc,
      },
      extensions: globalVars.extensions,
    },
    entry: {
      index: [path.resolve(globalVars.appSrc, 'index.ts')],
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
      clean: globalVars.config.build.emptyOutDir && !isDev, //替代 clean-webpack-plugin
      ...globalVars.wpPaths.output,
    },
    stats: {
      errorDetails: true,
    },
  }
  wpChain.merge(config)
}
