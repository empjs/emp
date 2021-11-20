// import path from 'path'
import store from 'src/helper/store'
import wpChain from 'src/helper/wpChain'
import {Configuration} from 'webpack'
class WPCommon {
  isDev = true
  isESM = false
  constructor() {}
  async setup() {
    this.isDev = store.config.mode === 'development'
    this.isESM = store.isESM
    this.setCommon()
  }
  private setCommon() {
    const config: Configuration = {
      /* cache: {
        type: 'filesystem',
        cacheDirectory: store.cacheDir,
      }, */
      resolve: this.resolve,
      // externalsType: 'script',
      externals: store.empShare.externals,
      experiments: this.experiments,
      // externalsType: 'module',
      // target: store.config.build.target,
      output: this.output,
      stats: this.stats,
    }
    if (this.isESM) {
      config.externalsType = 'module'
      // config.externalsType = 'import'
    }
    wpChain.merge(config)
  }
  get experiments() {
    return {
      outputModule: this.isESM,
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
          module: true,
          dynamicImport: true,
        }
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
      publicPath: store.config.build.useLib ? store.config.base : 'auto',
      filename: 'js/[name].[contenthash:8].js',
      assetModuleFilename: `${store.config.build.assetsDir}/[name].[contenthash:8][ext][query]`,
      environment,
      // scriptType: isESM ? 'module' : 'text/javascript',
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
      colors: true,
      preset: 'minimal',
      moduleTrace: true,
      errorDetails: true,
    }
  }
}
export default WPCommon
