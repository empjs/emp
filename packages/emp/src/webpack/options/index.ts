import {Configuration} from 'webpack'
import store from 'src/helper/store'
import fs from 'fs-extra'
import WpPluginOptions from 'src/webpack/options/plugin'
import WpModuleOptions from 'src/webpack/options/module'
import wpExternalsOptions from 'src/webpack/options/externals'
import {externalAssetsType} from 'src/types'
class WpOptions {
  output: Configuration['output'] = {}
  resolve: Configuration['resolve'] = {}
  mode: Configuration['mode'] = 'none'
  stats: Configuration['stats'] = {}
  plugins = new WpPluginOptions()
  modules = new WpModuleOptions()
  entry?: Configuration['entry'] = {}
  external: Configuration['externals'] = {}
  externalAssets: externalAssetsType = {js: [], css: []}
  constructor() {}
  async setup(mode: Configuration['mode']) {
    this.mode = mode
    this.setOput()
    this.setResolve()
    this.setStats()
    // 先执行 entry 有助于 external 与之联动
    /* await wpExternalsOptions.setup(this.external, this.externalAssets)
    await this.plugins.setup()
    await this.modules.setup()
    await this.setEntry() */
    await Promise.all([
      wpExternalsOptions.setup(this.external, this.externalAssets),
      this.plugins.setup(),
      this.modules.setup(),
      this.setEntry(),
    ])
  }
  async setEntry() {
    const {resolve} = store
    if (!store.config.appEntry) {
      //默认入口排查
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
      this.entry = appEntry ? {index: [appEntry]} : {}
      return
    }
    this.entry = {index: [store.config.appEntry]}
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
      // scriptType: isESM ? 'module' : 'text/javascript',
    }
  }
  setResolve() {
    this.resolve = {
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
  setStats() {
    this.stats = {
      colors: true,
      preset: 'minimal',
      moduleTrace: true,
      errorDetails: true,
    }
  }
}

export default WpOptions
