import store from 'src/helper/store'
import DTSEmitFile from './dts'
import glob from 'fast-glob'
import logger, {logTag} from 'src/helper/logger'
import {MFOptions} from 'src/types'

const {parentPort} = require('worker_threads')

parentPort.on('message', async (payload: any) => {
  const options = JSON.parse(payload)
  if (options) {
    const dts = new DTSEmitFile()
    dts.setup(options)
    logger.info('[ === DTS build in worker threads === ]')
    const dtslist = await glob([`${store.config.appSrc}/**/*.(ts|tsx)`])
    dtslist.map(d => {
      dts.emit(d, options.alias, options.typesOutDir)
    })
    dts.createFile()
    parentPort.postMessage('finish')
  }
})
