import {JscTarget} from '@swc/core'
export type BuildOptions = {
  /**
   * 生成代码 参考 https://swc.rs/docs/configuring-swc#jsctarget
   */
  target?: JscTarget
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
}

export const initBuild = (op?: BuildOptions): Required<BuildOptions> => {
  return {...{target: 'es2022', outDir: 'dist', assetsDir: 'assets', minify: true}, ...op}
}
