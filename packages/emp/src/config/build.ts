import {JscConfig} from '@efox/swc-loader/types/swcType'
export type BuildOptions = {
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
   * @default true
   */
  sourcemap?: boolean | 'inline' | 'hidden'
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
}

export const initBuild = (op?: BuildOptions): Required<BuildOptions> => {
  return {
    ...{
      // target: 'es2018',
      target: 'es5',
      outDir: 'dist',
      assetsDir: 'assets',
      minify: true,
      sourcemap: true,
      useLib: false,
      emptyOutDir: true,
    },
    ...op,
  }
}
