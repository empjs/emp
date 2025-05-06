import logger from 'src/helper/logger'
import {clearConsole} from 'src/helper/utils'
import store from 'src/store'
//
export class BaseScript {
  // 实现整体生命周期运转
  async setup(cliName: string, o: any) {
    logger.time(`[${cliName}]Setup`)
    //实例化 store
    await store.setup(cliName, o)
    // 是否清除上一个日志
    if (store.debug.clearLog) {
      clearConsole()
    }
    logger.title(`${cliName}`)
    logger.time(`[${cliName}]Run`)
    await this.run()
    this.processExit()
    logger.timeEnd(`[${cliName}]Run`)
    logger.timeEnd(`[${cliName}]Setup`)
  }
  async run() {}
  processExit() {
    process.on('SIGINT', function () {
      process.exit()
    })
  }
}
