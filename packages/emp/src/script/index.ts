import globalVars from 'src/helper/globalVars'
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
    await globalVars.setConfig(webpackEnv, cliOptions)
    // webpack实例化
    const wpConfig = new WPConfig()
    await wpConfig.setup()
    // 执行cli脚本
    const RumtimeScript = await import(`./${name}`)
    new RumtimeScript.default()
  }
}

export default new EMPScript()
