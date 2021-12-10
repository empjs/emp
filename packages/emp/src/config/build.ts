import {JscConfig} from '@swc/core'
import {Override} from 'src/types'
import {LibModeType} from 'src/types/libMode'
import {Configuration} from 'webpack'
export type BuildOptions = {
  /**
   * swc 是否异步构建
   * @default false
   */
  sync?: boolean
  /**
   * 生成代码 参考 https://swc.rs/docs/configuring-swc#jsctarget
   */
  target?: JscConfig['target']
  wpTarget?: Configuration['target']
  /**
   * 生成代码目录
   * @default 'dist'
   */
  outDir?: string
  /**
   * 生成静态目录
   * @default 'assets'
   */
  assetsDir?: string
  /**
   * 是否压缩
   * @default true
   */
  minify?: boolean
  /**
   * 是否生成 source map
   * @default false
   */
  sourcemap?: boolean
  // sourcemap?: boolean | 'inline' | 'hidden'
  /**
   * 使用 库模式
   */
  lib?: LibModeType
  /**
   * 是否清空生成文件夹
   * @default true
   */
  emptyOutDir?: boolean
  /**
   * chunkIds
   * @default named|deterministic
   */
  chunkIds?: false | 'natural' | 'named' | 'deterministic' | 'size' | 'total-size'
  /**
   * analyze 是否生成分析报告 根据 cliOptions `--analyze` 生成
   * @default false
   */
  analyze?: boolean
  /**
   * typesOutDir 类型生成目录
   * @default dist/empShareTypes
   */
  typesOutDir?: string
  /**
   * typesEmpName empShare d.ts 入口 [index.d.ts]
   * @default index
   */
  typesEmpName?: string
  /**
   * typesLibName project d.ts 入口 [lib.d.ts]
   * @default lib
   */
  typesLibName?: string
  /**
   * createTs
   * @default false
   */
  createTs?: boolean
}
export type RquireBuildOptions = Override<
  Required<BuildOptions>,
  {
    lib?: LibModeType
    wpTarget?: Configuration['target']
  }
>
export const initBuild = (op?: BuildOptions): RquireBuildOptions => {
  return {
    ...{
      sync: false,
      // target: 'es2018',
      target: 'es5',
      outDir: 'dist',
      typesOutDir: 'dist/empShareTypes',
      typesLibName: 'lib',
      typesEmpName: 'index',
      assetsDir: 'assets',
      minify: true,
      sourcemap: false,
      /**
       * 开发模式参考 https://webpack.js.org/concepts/targets/#multiple-targets
       */
      // useLib: false,
      emptyOutDir: true,
      chunkIds: false,
      analyze: false,
      createTs: false,
    },
    ...op,
  }
}
