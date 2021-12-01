import store from 'src/helper/store'
import {cliOptionsType, modeType} from 'src/types'
import wpConfig from 'src/webpack'
import configPlugins from 'src/config/plugins'
import configChain from 'src/config/chain'
class EMPScript {
  constructor() {}
  /**
   * 执行命令相关脚本
   * @param name
   */
  async exec(name: string, mode: modeType, cliOptions: cliOptionsType, pkg: any): Promise<void> {
    // 全局变量实例化 store & config
    await store.setup(mode, cliOptions, pkg)
    // webpack实例化
    await wpConfig.setup()
    // 初始化所有 EMP Plugins
    await configPlugins.setup()
    // webpack Chain
    await configChain.setup()
    // 执行cli脚本
    const cilScript = await import(`./${name}`)
    await cilScript.default.setup()
  }
}

export default new EMPScript()
