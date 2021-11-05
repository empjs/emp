import fs from 'fs-extra'
import path from 'path'
import {EMPConfigExport, EMPConfig, initConfig, ResovleConfig} from './config'
class Paths {
  public root = process.cwd()
  public config: ResovleConfig
  public resolve = (relativePath: string) => path.resolve(this.root, relativePath)
  public appSrc: string
  public outDir: string
  constructor() {
    this.config = initConfig()
    this.appSrc = this.resolve(this.config.appSrc)
    this.outDir = this.resolve(this.config.build.outDir)
  }
  async setConfig() {
    const fp = this.resolve('emp-config.js')
    if (fs.existsSync(fp)) {
      const configExport: EMPConfigExport = require(fp)
      if (typeof configExport === 'function') {
        const conf = await configExport()
        this.config = initConfig(conf)
      } else if (typeof configExport === 'object') {
        const conf: any = configExport
        this.config = initConfig(conf)
      }
    }
    this.appSrc = this.config.appSrc ? this.resolve(this.config.appSrc) : this.appSrc
    console.log('this.config', this)
  }
}
export default Paths
