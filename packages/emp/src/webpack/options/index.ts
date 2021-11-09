import {Configuration} from 'webpack'
import store from 'src/helper/store'
import WpPluginOptions from 'src/webpack/options/plugin'
import WpModuleOptions from 'src/webpack/options/module'
class WpOptions {
  output: Configuration['output'] = {}
  resolve: Configuration['resolve'] = {}
  mode: Configuration['mode'] = 'none'
  stats: Configuration['stats'] = {}
  plugins?: WpPluginOptions
  modules?: WpModuleOptions
  constructor() {}
  async setup(mode: Configuration['mode']) {
    this.mode = mode
    this.setOput()
    this.setResolve()
    this.setStats()
    this.plugins = new WpPluginOptions()
    this.modules = new WpModuleOptions()
  }
  setOput() {
    const isESM = ['es3', 'es5'].indexOf(store.config.build.target) === -1
    const environment = !isESM
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
    this.output = {
      path: store.outDir,
      publicPath: store.config.build.useLib ? store.config.base : 'auto',
      filename: 'js/[name].[contenthash:8].js',
      assetModuleFilename: `${store.config.build.assetsDir}/[name].[contenthash:8][ext][query]`,
      environment,
      // scriptType: ['es3', 'es5'].indexOf(this.config.build.target) === -1 ? 'module' : 'text/javascript',
    }
  }
  setResolve() {
    this.resolve = {
      modules: [store.resolve('src'), 'node_modules'],
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
  setStats() {
    this.stats = {
      // all: false,
      colors: true,
      preset: 'minimal',
      // preset: 'none',
      moduleTrace: true,
      errorDetails: true,
      //=========================
      // moduleAssets: false,
      // groupAssetsByChunk: true,
      // nestedModules: false,
      // runtimeModules: false,
      // dependentModules: false,
      // children: false,
      // chunkGroups: false,
      // chunkModules: false,
      // chunkOrigins: false,
      // modules: false,
      // relatedAssets: false,
      // chunkGroupAuxiliary: false,
      // chunkRelations: false,
      // ids: false,
      // usedExports: false,
      // timings: true,
      // providedExports: true,
      //================================

      //
      // assets: true,
      // assetsSort: '!size',
      //
      // version: true, //显示 webpack 版本
    }
    /* if (store.config.mode === 'production') {
      this.stats = {
        ...this.stats,
        ...{
          // preset: 'none',
          chunks: true,
          chunksSort: '!size',
          assets: true,
          assetsSort: '!size',
        },
      }
    } */
  }
}

export default WpOptions
