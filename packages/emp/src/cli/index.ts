import store from 'src/helper/store'
import {cliOptionsType, modeType} from 'src/types'
// import wpConfig from 'src/webpack'
// import wpLibMode from 'src/webpack/wpLibMode'
import configPlugins from 'src/config/plugins'
import configChain from 'src/config/chain'
class EMPScript {
  // 执行文件名称
  name = ''
  constructor() {}
  /**
   * 执行命令相关脚本
   * @param name
   */
  async exec(name: string, mode: modeType, cliOptions: cliOptionsType, pkg: any): Promise<void> {
    this.name = name
    // 全局变量实例化 store & config
    await store.setup(mode, cliOptions, pkg)
    //模式层
    await this.selectMode()
    // 初始化所有 EMP Plugins
    await configPlugins.setup()
    // webpack Chain
    await configChain.setup()
    // 执行cli脚本
    const cilScript = await import(`./${this.name}`)
    await cilScript.default.setup()
  }
  async selectMode() {
    if (store.config.build.lib) {
      // 库模式实例化
      await (await import('src/webpack/wpLibMode')).default.setup()
      // 执行 build操作
      this.name = 'build'
    } else {
      // web实例化
      await (await import('src/webpack')).default.setup()
    }
  }
}

export default new EMPScript()
