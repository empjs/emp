import {Compiler, Compilation} from 'webpack'
import dts, {DTSTLoadertype} from './dts'
import glob from 'fast-glob'
import store from 'src/helper/store'
import {logTag} from 'src/helper/logger'
//
const PLUGIN_NAME = 'DTSPlugin'
//
class DTSPlugin {
  options?: DTSTLoadertype
  constructor(options: DTSTLoadertype) {
    this.options = options
  }
  apply(compiler: Compiler) {
    const options = this.options
    compiler.hooks.afterEmit.tap(PLUGIN_NAME, async compilation => {
      if (options) {
        dts.setup(options)
        logTag('dts build:', 'yellow')
        const dtslist = await glob([`${store.config.appSrc}/**/*.(ts|tsx)`])
        dtslist.map(d => {
          dts.emit(d)
        })
        dts.createFile()
      }
    })
  }
}
export default DTSPlugin
