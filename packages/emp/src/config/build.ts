import {Override, JscTarget} from 'src/types'
import {LibModeType} from 'src/types/libMode'
import {TerserOptions} from 'terser-webpack-plugin/types/utils'
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
  target?: JscTarget
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
   * 生成包含 js,css,asset 合集目录
   * @default ''
   */
  staticDir?: string
  /**
   * 是否压缩 或者利用 swc 压缩
   * @default true
   */
  minify?: boolean | 'swc' | 'esbuild'
  /**
   * 压缩选项?
   * @default {compress:false}
   */
  minOptions?: TerserOptions
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
  /**
   * 支持在 js 中使用 jsx
   * @default false
   */
  jsToJsx?: boolean
}
export type RquireBuildOptions = Override<
  Required<BuildOptions>,
  {
    lib?: LibModeType
    wpTarget?: Configuration['target']
    minOptions?: TerserOptions
    /**swc plugin */
    plugin?: any
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
      typesLibName: 'lib.d.ts',
      typesEmpName: 'index.d.ts',
      assetsDir: 'assets',
      staticDir: '',
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
      jsToJsx: false,
    },
    ...op,
  }
}
