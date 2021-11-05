import Paths from 'src/helper/paths'
class EMPScript {
  paths: Paths
  constructor() {
    this.paths = new Paths()
  }
  /**
   * 执行命令相关脚本
   * @param name
   */
  async exec(name: string): Promise<void> {
    await this.paths.setConfig()
    const RumtimeScript = await import(`./${name}`)
    new RumtimeScript.default(this.paths)
  }
}

export default new EMPScript()
