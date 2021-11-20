import {MFOptions} from './modulefederation'
import {ResovleConfig} from 'src/config'
export type EMPshareLibItemType = {
  [module: string]:
    | {
        entry: string
        global?: string
        type?: 'js' | 'css'
      }
    | string
    | string[]
}
export type EMPShareType = MFOptions & {
  /**
   * emp 基于库共享模块
   */
  shareLib?: EMPshareLibItemType
}
export type EMPShareFunc = (config: ResovleConfig) => EMPShareType | Promise<EMPShareType>
export type EMPShareExport = EMPShareType | EMPShareFunc
