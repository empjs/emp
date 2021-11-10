import store from 'src/helper/store'
import {cliOptionsType, modeType} from 'src/types'
import WPConfig from 'src/webpack'
import configPlugins from 'src/config/plugins'
class EMPScript {
  constructor() {}
  /**
   * 执行命令相关脚本
   * @param name
   */
  async exec(name: string, mode: modeType, cliOptions: cliOptionsType, pkg: any): Promise<void> {
    // 全局变量实例化
    await store.setConfig(mode, cliOptions, pkg)
    // webpack实例化
    const wpConfig = new WPConfig()
    await wpConfig.setup()
    // 初始化所有 EMP Plugins
    await configPlugins.setup()
    // 执行cli脚本
    const cilScript = await import(`./${name}`)
    await cilScript.default.setup()
  }
}

export default new EMPScript()
