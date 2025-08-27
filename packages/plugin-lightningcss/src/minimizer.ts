import {Buffer} from 'node:buffer'
import type {Compilation, Compiler} from '@empjs/cli'
import {transform as _transform} from 'lightningcss'
import type {LightningCSSMinifyPluginOptions} from './types'

const PLUGIN_NAME = 'lightningcss-minify-plugin'
//
const CSS_REGEX = /\.css(?:\?.*)?$/i

export class LightningCSSMinifyPlugin {
  private readonly options: LightningCSSMinifyPluginOptions

  private readonly transform: typeof _transform
  name = 'LightningCSSMinifyPlugin'
  constructor(opts: LightningCSSMinifyPluginOptions = {}) {
    const {implementation} = opts

    if (implementation && typeof (implementation as any).transform !== 'function') {
      throw new TypeError(
        `[${PLUGIN_NAME}]: implementation.transform must be an 'lightningcss' transform function. Received ${typeof (implementation as any).transform}`,
      )
    }

    this.transform = (implementation as any)?.transform ?? _transform
    this.options = opts
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: PLUGIN_NAME,
          stage: (compilation as any)?.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
        },
        async () => await this.transformAssets(compilation),
      )

      compilation.hooks.statsPrinter.tap(PLUGIN_NAME, statsPrinter => {
        statsPrinter.hooks.print
          .for('asset.info.minimized')
          .tap(PLUGIN_NAME, (minimized, {green, formatFlag}) =>
            minimized && green && formatFlag ? green(formatFlag('minimized')) : '',
          )
      })
    })
  }

  private async transformAssets(compilation: Compilation): Promise<void> {
    const {
      options: {devtool},
      webpack: {
        sources: {SourceMapSource, RawSource},
      },
    } = compilation.compiler

    const sourcemap =
      this.options.sourceMap === undefined
        ? ((devtool && (devtool as string).includes('source-map')) as boolean)
        : this.options.sourceMap

    const {targets, ...transformOptions} = this.options

    const assets = compilation.getAssets().filter(
      asset =>
        // Filter out already minimized
        !asset.info.minimized &&
        // Filter out by file type
        CSS_REGEX.test(asset.name),
    )

    await Promise.all(
      assets.map(async asset => {
        const {source, map} = asset.source.sourceAndMap()
        const sourceAsString = source.toString()
        const code = typeof source === 'string' ? Buffer.from(source) : source

        const result = this.transform({
          filename: asset.name,
          code,
          minify: true,
          sourceMap: sourcemap,
          ...transformOptions,
          targets,
        })
        const codeString = result.code.toString()
        // console.log('LightningCSSMinifyPlugin', codeString)
        compilation.updateAsset(
          asset.name,
          sourcemap
            ? new SourceMapSource(
                codeString,
                asset.name,
                JSON.parse(result.map!.toString()),
                sourceAsString,
                map as any,
                true,
              )
            : new RawSource(codeString),
          {
            ...asset.info,
            minimized: true,
          },
        )
      }),
    )
  }
}

export default LightningCSSMinifyPlugin
