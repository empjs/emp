import {Configuration} from '.pnpm/webpack@5.62.1_@swc+core@1.2.106/node_modules/webpack'
import {ResovleConfig} from 'src/config'
import store from 'src/helper/store'

export type ExternalsItemType = {
  /**
   * 模块名 如 react
   */
  module: string
  /**
   * 入口地址
   */
  entry: string
  /**
   * 全局变量
   */
  global: string
}
export type ExternalsType = (config: ResovleConfig) => ExternalsItemType[] | Promise<ExternalsItemType[]>
class WpExternalsOptions {
  constructor() {}
  async setup(externals: any, externalAssets: string[] = []): Promise<void> {
    if (store.config.externals) {
      const list = await store.config.externals(store.config)
      list.map(v => {
        // externals[v.module] = `${v.global}@${v.entry}`
        // externals[v.module] = [v.entry, v.global]
        externals[v.module] = v.global
        externalAssets.push(v.entry)
        // console.log('entry', entry)
        // entry.index.push(v.entry)
      })
    }
  }
}

export default new WpExternalsOptions()
