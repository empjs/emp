import store from 'src/helper/store'
import {cliOptionsType, modeType} from 'src/types'
import WPConfig from 'src/webpack'
class EMPScript {
  constructor() {}
  /**
   * 执行命令相关脚本
   * @param name
   */
  async exec(name: string, webpackEnv: modeType, cliOptions: cliOptionsType): Promise<void> {
    // 全局变量实例化
    await store.setConfig(webpackEnv, cliOptions)
    // webpack实例化
    const wpConfig = new WPConfig()
    await wpConfig.setup()
    // 执行cli脚本
    const cilScript = await import(`./${name}`)
    await cilScript.default.setup()
  }
}

export default new EMPScript()