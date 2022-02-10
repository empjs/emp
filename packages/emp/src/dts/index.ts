import {Compiler, Compilation} from 'webpack'
import DTSEmitFile, {DTSTLoadertype} from './dts'
import glob from 'fast-glob'
import store from 'src/helper/store'
import {logTag} from 'src/helper/logger'
import {Worker} from 'worker_threads'
//
const PLUGIN_NAME = 'DTSPlugin'

//
class DTSPlugin {
  options?: DTSTLoadertype
  constructor(options: DTSTLoadertype) {
    this.options = options
  }
  apply(compiler: Compiler) {
    compiler.hooks.watchRun.tap('WatchRun', comp => {
      emitDts('watch')
    })
  }
}

export function emitDts(status?: string) {
  const dtsThread = new Worker(__dirname + '/dtsThread.js')
  dtsThread.postMessage(
    JSON.stringify({
      build: store.config.build,
      mf: store.config.moduleFederation,
      alias: store.config.resolve.alias,
      typesOutDir: store.config.build.typesOutDir,
    }),
  )
  dtsThread.on('message', res => {
    if (res === 'finish' && status !== 'watch') dtsThread.terminate()
  })
}

export default DTSPlugin
