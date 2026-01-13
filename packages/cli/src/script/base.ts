import {rspackVersion} from '@rspack/core'
import logger from 'src/helper/logger'
import {clearConsole} from 'src/helper/utils'
import store from 'src/store'
import {CliActionType, CliOptionsType} from 'src/types/env'
//
export class BaseScript {
  // 实现整体生命周期运转
  async setup(cliAction?: CliActionType, cliOptions?: CliOptionsType) {
    const timeCliTag = `${cliAction}.setup`
    const timeCliRunTag = `${cliAction}.run`
    logger.time(timeCliTag)
    //实例化 store
    await store.setup(cliAction, cliOptions)
    // 是否清除上一个日志
    // if (store.debug.clearLog) {
    //   clearConsole()
    // }
    store.empConfig.showLogTitle({cliAction, cliOptions, rspackVersion, empVersion: store.empPkg.version})

    logger.time(timeCliRunTag)
    await this.run()
    this.processExit()
    logger.timeEnd(timeCliRunTag)
    logger.timeEnd(timeCliTag)
  }
  async run() {}
  processExit() {
    process.on('SIGINT', function () {
      process.exit()
    })
  }
}
