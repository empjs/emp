// import path from 'path'
import store from 'src/helper/store'
import wpChain from 'src/helper/wpChain'
import {Configuration} from 'webpack'
class WPCommon {
  isDev = true
  constructor() {}
  async setup() {
    this.isDev = store.config.mode === 'development'
    this.setCommon()
  }
  private setCommon() {
    const {cache, resolve, experiments, output, stats} = this
    const config: Configuration = {
      cache,
      resolve,
      externals: store.empShare.externals,
      experiments,
      output,
      stats,
    }
    if (store.isESM) {
      config.externalsType = 'module'
      // config.externalsType = 'import'
      //config.externalsType = 'script'
      // es need!
      // config.target = store.config.build.target
      if (store.config.build.target) {
        config.target = ['web', store.config.build.target]
      }
    }
    wpChain.merge(config)
  }
  get cache() {
    /* return {
      type: 'filesystem',
      cacheDirectory: store.cacheDir,
    } */
    return false
  }
  get experiments() {
    return {
      outputModule: store.isESM,
      topLevelAwait: true,
      // buildHttp: {allowedUris: []},//影响热更
      backCompat: true,
    }
  }
  get output() {
    const environment = !store.isESM
      ? {
          arrowFunction: false,
          bigIntLiteral: false,
          const: false,
          destructuring: false,
          forOf: false,
          dynamicImport: false,
          module: false,
        }
      : {
          // module: true,
          // dynamicImport: true,
        }
    const publicPath = store.config.base || ''
    return {
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
      clean: store.config.build.emptyOutDir && !this.isDev, //替代 clean-webpack-plugin
      path: store.outDir,
      publicPath: store.config.build.useLib ? publicPath : 'auto',
      filename: 'js/[name].[contenthash:8].js',
      assetModuleFilename: `${store.config.build.assetsDir}/[name].[contenthash:8][ext][query]`,
      environment,
      // scriptType: isESM ? 'module' : 'text/javascript',
      pathinfo: false, //在打包数千个模块的项目中，这会导致造成垃圾回收性能压力
    }
  }
  get resolve() {
    return {
      modules: [
        'node_modules', //默认
        store.resolve('node_modules'), // 项目
        store.empResolve('node_modules'), // emp
        store.resolve('src'), // 项目src
      ],
      alias: {
        src: store.appSrc,
      },
      extensions: [
        '.js',
        '.jsx',
        '.mjs',
        '.ts',
        '.tsx',
        '.css',
        '.less',
        '.scss',
        '.sass',
        '.json',
        '.wasm',
        '.vue',
        '.svg',
        '.svga',
      ],
    }
  }
  get stats() {
    return {
      // colors: true,
      // preset: 'none',
      preset: 'errors-warnings',
      // moduleTrace: true,
      // errorDetails: true,
    }
  }
}
export default WPCommon
