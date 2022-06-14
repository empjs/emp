import {Compiler, Compilation} from 'webpack'
import DTSEmitFile, {DTSOptionsType, DTSTLoadertype} from './dts'
import glob from 'fast-glob'
import store from 'src/helper/store'
import logger, {logTag} from 'src/helper/logger'
import {Worker} from 'worker_threads'
import {MFOptions} from 'src/types'

const plugin = {
  name: 'DTSPlugin',
}

class DTSPlugin {
  options?: DTSTLoadertype
  constructor(options: DTSTLoadertype) {
    this.options = options
  }
  dtsThread: Worker | undefined = undefined
  apply(compiler: Compiler) {
    compiler.hooks.watchRun.tap('WatchRun', comp => {
      if (!this.dtsThread) {
        this.dtsThread = createDtsEmitThread()
      }
      emitDts(this.dtsThread)
    })
    const isTypeForOutDir = store.config.build.outDir === store.config.build.typesOutDir
    isTypeForOutDir &&
      compiler.hooks.afterEmit.tap(plugin, compilation => {
        logger.debug('[afterEmit] createDtsEmitThreadForBuild')
        createDtsEmitThreadForBuild()
      })
  }
}

export function createDtsEmitThread() {
  logTag('dts building in worker thread.', 'black')
  return new Worker(__dirname + '/dtsThread.js')
}

/**
 * build 期间用的dts
 */
export function createDtsEmitThreadForBuild() {
  const dtsThread = createDtsEmitThread()
  emitDts(dtsThread)
  dtsThread.on('message', res => {
    dtsThread.terminate()
    if (res === 'finish') dtsThread.terminate()
  })
}

export function emitDts(dtsThread: Worker) {
  const op: DTSOptionsType = {
    appSrc: store.config.appSrc,
    appAbsSrc: store.appSrc,
    build: store.config.build,
    mf: store.empShare.moduleFederation,
    alias: store.config.resolve.alias,
    typesOutDir: store.config.build.typesOutDir,
    needClear: !(store.config.build.outDir === store.config.build.typesOutDir),
    pkgName: store.pkg.name,
  }
  dtsThread.postMessage(JSON.stringify(op))
}

export default DTSPlugin
