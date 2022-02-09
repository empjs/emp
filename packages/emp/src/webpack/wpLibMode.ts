import path from 'path'
import {buildLibType, LibModeType} from 'src/types'
import store from 'src/helper/store'
import wpChain, {WPChain} from 'src/helper/wpChain'
import {Configuration} from 'webpack'
import WPModule from './module'
class WPLibMode {
  libConfig: LibModeType
  wpconfigs: Configuration[] = []
  isDev = false
  module = new WPModule()

  constructor() {
    this.libConfig = {
      name: 'index',
      entry: 'index.js',
      formats: ['umd'],
    }
  }
  async setup() {
    this.isDev = store.config.mode === 'development'
    this.initBuildLib()
    this.resetWpchain()
    //
    for (const format of this.libConfig.formats) {
      await this.libTarget(format)
      this.resetConfig(format)
    }
    if (store.config.debug.wplogger) console.log('[webpack config]', JSON.stringify(this.wpconfigs, null, 2))
    return this.wpconfigs
  }
  private resetWpchain() {
    // Object.keys(this.libConfig.entry).map(k => wpChain.plugins.delete('html_plugin_' + k))
    // if (this.libConfig.name) {
    //   wpChain.plugins.delete('html_plugin_' + this.libConfig.name)
    // }
    wpChain.plugins.delete('html_plugin_index')
    wpChain.plugins.delete('mf')
    // externals
    if (this.libConfig.external) {
      wpChain.externals(this.libConfig.external)
    }
    if (store.config.mode === 'production') {
      wpChain.plugins.delete('copy')
      // wpChain.devtool('source-map')
    }
    //{minimize: !this.isDev, chunkIds: 'named', emitOnErrors: true}
    // wpChain.optimization.splitChunks({chunks: 'all'})
  }
  private resetConfig(format: buildLibType) {
    const config: Configuration = wpChain.toConfig()
    if (config.devServer) {
      delete config.devServer
    }

    const wp: Configuration = {...config, ...{watch: this.isDev}}
    // wp.entry = {[this.libConfig.name || 'index']: this.libConfig.entry}
    wp.entry = this.libConfig.entry
    wp.cache =
      typeof wp.cache === 'object'
        ? {
            ...wp.cache,
            ...{
              name: `${store.pkg.name || 'emp'}-${store.config.mode}-${store.config.env || 'local'}-${
                store.pkg.version
              }-${format}`,
              type: 'filesystem',
            },
          }
        : wp.cache

    wp.resolve = {...wp.resolve, ...{extensions: ['.js', '.mjs', '.ts', '.json', '.wasm']}}
    wp.output = {
      ...wp.output,
      ...{
        clean: wp.output?.clean || true,
        path: store.resolve(path.join(store.outDir, format)),
        filename:
          typeof this.libConfig.fileName === 'function'
            ? this.libConfig.fileName(format)
            : typeof this.libConfig.fileName === 'string'
            ? this.libConfig.fileName
            : `[name].js`,
        // library: {type: format === 'esm' ? 'module' : format},
        assetModuleFilename: '[name][ext]',
        // chunkFormat: format === 'esm' ? 'module' : 'array-push',
      },
    }
    //
    // delete wp.output.assetModuleFilename
    wp.output.library = {type: format === 'esm' ? 'module' : format}
    if (format !== 'esm') {
      wp.output.library.name = this.libConfig.name
    }
    if (format === 'umd') {
      wp.output.umdNamedDefine = true
    }
    wp.optimization = {...wp.optimization, ...{chunkIds: 'named', emitOnErrors: true}}
    const isESM = format === 'esm'
    //
    wp.target = ['web', store.config.build.target]
    // wp.target = store.config.build.target
    wp.experiments = {...wp.experiments, ...{outputModule: isESM}}
    //
    if (isESM) {
      wp.externalsType = 'module'
      wp.output.environment = {}
    }
    this.wpconfigs.push(wp)
  }
  private initBuildLib() {
    this.libConfig = {...this.libConfig, ...store.config.build.lib}
  }
  private async libTarget(format: buildLibType) {
    if (format === 'esm') {
      store.isESM = true
      store.config.build.target = format === 'esm' ? 'es2018' : 'es5'
    }
    await Promise.all([this.module.setup()])
  }
}

export default new WPLibMode()
