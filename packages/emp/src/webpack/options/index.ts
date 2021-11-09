import {Configuration} from 'webpack'
import store from 'src/helper/store'
import fs from 'fs-extra'
import WpPluginOptions from 'src/webpack/options/plugin'
import WpModuleOptions from 'src/webpack/options/module'
import wpExternalsOptions from 'src/webpack/options/externals'
class WpOptions {
  output: Configuration['output'] = {}
  resolve: Configuration['resolve'] = {}
  mode: Configuration['mode'] = 'none'
  stats: Configuration['stats'] = {}
  plugins?: WpPluginOptions
  modules?: WpModuleOptions
  entry?: Configuration['entry'] = {}
  external: Configuration['externals'] = {}
  externalAssets: string[] = []
  constructor() {}
  async setup(mode: Configuration['mode']) {
    this.mode = mode
    this.setOput()
    this.setResolve()
    this.setStats()
    // 先执行 entry 有助于 external 与之联动
    await wpExternalsOptions.setup(this.external, this.externalAssets)
    this.plugins = new WpPluginOptions()
    this.modules = new WpModuleOptions()
    this.entry = await this.setEntry()
  }
  async setEntry(): Promise<any> {
    const {resolve} = store
    if (!store.config.appEntry) {
      const existsEntry = (relativePath: string) => fs.pathExists(resolve(relativePath))
      const defaultEntry = async () => {
        const [isTS, isTSX, isJSX, isJS] = await Promise.all([
          existsEntry('src/index.ts'),
          existsEntry('src/index.tsx'),
          existsEntry('src/index.jsx'),
          existsEntry('src/index.js'),
        ])
        if (isTS) return resolve('src/index.ts')
        if (isTSX) return resolve('src/index.tsx')
        else if (isJS) resolve('src/index.js')
        else if (isJSX) return resolve('src/index.jsx')
      }
      const appEntry = await defaultEntry()
      return appEntry ? {index: [appEntry]} : {}
    }
    return {index: [store.config.appEntry]}
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
