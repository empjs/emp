import WPModule from './module'
import WPPlugin from './plugin'
import WPCommon from './common'
import {buildLibType, LibModeType} from 'src/types'
import store from 'src/helper/store'
import wpChain from 'src/helper/wpChain'
class WPLibMode {
  common = new WPCommon()
  module = new WPModule()
  plugin = new WPPlugin()
  libConfig: LibModeType
  constructor() {
    this.libConfig = {entry: {ESvga: 'index.ts'}, formats: ['umd', 'esm']}
  }
  async setup() {
    this.initBuildLib()
    this.libTarget('esm')
    this.resetConfig()
    console.log(wpChain.toConfig())
  }
  private resetConfig() {
    wpChain.merge({
      mode: store.config.mode,
      watch: store.config.mode === 'development',
      output: {
        clean: true,
      },
      extensions: ['.js', '.mjs', '.ts', '.json', '.wasm'],
    })
  }
  private initBuildLib() {
    console.log(store.config.build.lib)
  }
  private async libTarget(format: buildLibType) {
    if (format === 'esm') {
      store.isESM = true
      store.config.build.target = !['es3', 'es5'].includes(store.config.build.target)
        ? store.config.build.target
        : 'es2018'
    }
    await Promise.all([this.common.setup(), this.module.setup(), this.plugin.setup()])
  }
}

export default new WPLibMode()
