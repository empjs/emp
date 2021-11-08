import {TransformOptions} from 'esbuild'
export type ESBUILDLoaderOptions = TransformOptions & {
  /**
   * 是否同步执行
   * @default false
   */
  sync?: boolean
}
