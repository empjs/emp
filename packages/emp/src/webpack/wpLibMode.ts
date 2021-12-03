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
    this.libConfig = {entry: {index: 'index.ts'}, formats: ['umd', 'esm']}
  }
  async setup() {
    this.isDev = store.config.mode === 'development'
    this.initBuildLib()
    this.resetWpchain()
    //
    // await Promise.all(
    //   this.libConfig.formats.map(async format => {
    //     await this.libTarget(format)
    //     this.resetConfig(format)
    //   }),
    // )
    for (const format of this.libConfig.formats) {
      // console.log('[libTarget format]', format)
      await this.libTarget(format)
      this.resetConfig(format)
    }
    // console.log('=== wpconfigs ===', this.wpconfigs)
    return this.wpconfigs
  }
  private resetWpchain() {
    Object.keys(this.libConfig.entry).map(k => wpChain.plugins.delete('html_plugin_' + k))
    wpChain.plugins.delete('mf')
    if (store.config.mode === 'production') {
      wpChain.plugins.delete('copy')
      wpChain.devtool('source-map')
    }
  }
  private resetConfig(format: buildLibType) {
    const config: Configuration = wpChain.toConfig()
    if (config.devServer) {
      delete config.devServer
    }

    const wp: Configuration = {...config, ...{watch: this.isDev}}
    const cache = wp.cache || {}
    wp.cache = {
      ...cache,
      ...{
        name: `${store.pkg.name || 'emp'}-${store.config.mode}-${store.config.env || 'local'}-${
          store.pkg.version
        }-${format}`,
        type: 'filesystem',
      },
    }
    wp.resolve = {...wp.resolve, ...{extensions: ['.js', '.mjs', '.ts', '.json', '.wasm']}}
    wp.output = {
      ...wp.output,
      ...{
        clean: true,
        path: store.resolve(path.join(store.outDir, format)),
        filename:
          typeof this.libConfig.fileName === 'function'
            ? this.libConfig.fileName(format)
            : typeof this.libConfig.fileName === 'string'
            ? this.libConfig.fileName
            : `[name].js`,
      },
    }
    wp.optimization = {...wp.optimization, ...{minimize: !this.isDev, chunkIds: 'named', emitOnErrors: true}}
    const isESM = format === 'esm'
    //
    wp.target = ['web', store.config.build.target]
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
