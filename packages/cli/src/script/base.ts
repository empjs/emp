import logger from 'src/helper/logger'
import {clearConsole} from 'src/helper/utils'
import store from 'src/store'
import {CliActionType, CliOptionsType} from 'src/types/env'
//
export class BaseScript {
  // 实现整体生命周期运转
  async setup(cliAction?: CliActionType, cliOptions?: CliOptionsType) {
    logger.time(`[${cliAction}]Setup`)
    //实例化 store
    await store.setup(cliAction, cliOptions)
    // 是否清除上一个日志
    // if (store.debug.clearLog) {
    //   clearConsole()
    // }
    logger.title(`${cliAction}`)
    logger.time(`[${cliAction}]Run`)
    await this.run()
    this.processExit()
    logger.timeEnd(`[${cliAction}]Run`)
    logger.timeEnd(`[${cliAction}]Setup`)
  }
  async run() {}
  processExit() {
    process.on('SIGINT', function () {
      process.exit()
    })
  }
}
