import {Configuration} from 'webpack'
import {ResovleConfig} from 'src/config'
import store from 'src/helper/store'
import {externalAssetsType} from 'src/types'

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
export type ExternalsType = (
  config: ResovleConfig,
) => ExternalsItemType[] | Promise<ExternalsItemType[]> | ExternalsItemType[]
class WpExternalsOptions {
  constructor() {}
  async setup(externals: any, externalAssets: externalAssetsType): Promise<void> {
    if (store.config.externals) {
      let list = []
      if (typeof store.config.externals === 'function') {
        list = await store.config.externals(store.config)
      } else {
        list = store.config.externals
      }
      list.map(v => {
        externals[v.module] = v.global
        externalAssets.js.push(v.entry)
      })
    }
  }
}

export default new WpExternalsOptions()
