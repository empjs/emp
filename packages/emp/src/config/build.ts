import {JscConfig} from '@swc/core'
export type BuildOptions = {
  /**
   * swc & esbuild 是否异步构建
   * @default false
   */
  sync?: boolean
  /**
   * 生成代码 参考 https://swc.rs/docs/configuring-swc#jsctarget
   */
  target?: JscConfig['target']
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
   * 是否使用 library模式
   * @default true
   */
  useLib?: boolean
  /**
   * 是否清空生成文件夹
   * @default true
   */
  emptyOutDir?: boolean
  /**
   * chunkIds
   */
  chunkIds?: false | 'natural' | 'named' | 'deterministic' | 'size' | 'total-size'
}

export const initBuild = (op?: BuildOptions): Required<BuildOptions> => {
  return {
    ...{
      sync: false,
      // target: 'es2018',
      target: 'es5',
      outDir: 'dist',
      assetsDir: 'assets',
      minify: true,
      sourcemap: false,
      useLib: false,
      emptyOutDir: true,
      chunkIds: false,
    },
    ...op,
  }
}
