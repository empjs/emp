import WPModule from './module'
import WPPlugin from './plugin'
import WPCommon from './common'
import {buildLibType, LibModeType} from 'src/types'
import store from 'src/helper/store'
import wpChain from 'src/helper/wpChain'
import {Configuration} from 'webpack'
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
    const wp: Configuration = {
      mode: store.config.mode,
      watch: store.config.mode === 'development',
      output: {
        clean: true,
      },
      resolve: {
        extensions: ['.js', '.mjs', '.ts', '.json', '.wasm'],
      },
    }
    wpChain.merge(wp)
  }
  private initBuildLib() {
    console.log(store.config.build.lib)
  }
  private async libTarget(format: buildLibType) {
    if (format === 'esm') {
      store.isESM = true
      //TODO 当 esm 时 需要重置 target 考虑开放多 target 自定义
      store.config.build.target = !['es3', 'es5'].includes(store.config.build.target)
        ? store.config.build.target
        : 'es2018'
    }
    await Promise.all([this.common.setup(), this.module.setup(), this.plugin.setup()])
  }
}

export default new WPLibMode()
