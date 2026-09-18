import type {CustomAtRules, TransformOptions} from 'lightningcss'

export type LightningCSSTransformOptions = Omit<TransformOptions<CustomAtRules>, 'filename' | 'code' | 'inputSourceMap'>

type Implementation = unknown // loose type of `typeof import('lightningcss')`

export type LightningCSSLoaderOptions = LightningCSSTransformOptions & {
  implementation?: Implementation
}

export type LightningCSSMinifyPluginOptions = Omit<LightningCSSTransformOptions, 'minify'> & {
  implementation?: Implementation
}

export type PluginLightningcssOptions = {
  /**
   * @see https://github.com/parcel-bundler/lightningcss/blob/master/node/index.d.ts
   * @default
   * {
   *   targets: browserslistToTargets(browserslist)
   * }
   */
  transform?: LightningCSSTransformOptions | boolean
  /**
   * @see https://github.com/parcel-bundler/lightningcss/blob/master/node/index.d.ts
   * @default
   * {
   *   targets: browserslistToTargets(browserslist)
   * }
   */
  minify?: LightningCSSTransformOptions | boolean
  /**
   * 自定义 lightningcss 实现，默认使用本包依赖的 `lightningcss`。
   * 传入对象必须提供 `transform` 函数，否则 loader / minimizer 都会直接抛出类型错误。
   * @example
   * import pluginLightningcss from '@empjs/plugin-lightningcss';
   * import lightningcss from 'lightningcss';
   * pluginLightningcss({
   *   implementation: lightningcss,
   *   minify: {exclude: lightningcss.Features.ColorFunction},
   * })
   */
  implementation?: Implementation
  /**
   * enable postcss config
   * @default false
   */
  enablePostcss?: boolean
}
