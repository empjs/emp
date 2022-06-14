import DTSEmitFile from './dts'
import glob from 'fast-glob'
import path from 'path'
const {parentPort} = require('worker_threads')

parentPort.on('message', async (payload: any) => {
  const options = JSON.parse(payload)
  const {appAbsSrc} = options
  if (options) {
    const dts = new DTSEmitFile()
    dts.setup(options)
    const pathStr = path.join(appAbsSrc, '**/*.(ts|tsx)').replace(/\\/g, '/')
    const dtslist = await glob([pathStr])
    // console.log('dtslist', dtslist, appSrc, `${appSrc}/**/*.(ts|tsx)`)
    dtslist.map(d => {
      dts.emit(d)
    })
    dts.createFile()
    parentPort.postMessage('finish')
  }
})
