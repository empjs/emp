import webpack from 'webpack'
import {RquireBuildOptions} from 'src/config/build'
import {TransformConfig, Options, JscConfig, transformSync, transform} from '@swc/core'
import store from 'src/helper/store'
// import logger from 'src/helper/logger'
const isDev = store.config.mode === 'development'

class SWCOpt {
  isTypescript = false
  isReact = false
  resetType(isTypescript: boolean, isReact: boolean) {
    this.isReact = isReact
    this.isTypescript = isTypescript
  }
  get parser(): JscConfig['parser'] {
    if (this.isTypescript) {
      return {
        syntax: 'typescript',
        tsx: this.isReact,
        decorators: true,
        dynamicImport: true, //
      }
    }
    return {
      syntax: 'ecmascript',
      jsx: this.isReact,
      decorators: true,
      decoratorsBeforeExport: false,
    }
  }
  get react(): TransformConfig['react'] {
    return this.isReact
      ? {
          runtime: store.config.reactRuntime || 'classic',
          refresh: isDev,
          development: isDev,
          useBuiltins: false,
        }
      : undefined
  }
}
const swcOpt = new SWCOpt()
/**
 * SWCLoader
 * @param this
 * @param source
 */
async function SWCLoader(
  this: webpack.LoaderContext<RquireBuildOptions>,
  source: string,
  // inputSourceMap: true,
) {
  const done = this.async()
  const options = this.getOptions()
  const build = options
  //
  const isESM = !['es3', 'es5'].includes(build.target)
  //
  const isTypescript = ['.ts', '.tsx'].some(p => this.resourcePath.endsWith(p))
  const isReact = ['.jsx', '.tsx', '.svg'].some(p => this.resourcePath.endsWith(p))
  swcOpt.resetType(isTypescript, isReact)
  const {parser, react} = swcOpt
  const swcOptions: Options = {
    sourceFileName: this.resourcePath,
    sourceMaps: this.sourceMap,
    jsc: {
      target: build.target,
      externalHelpers: false,
      loose: true,
      parser,
      transform: {
        legacyDecorator: true,
        decoratorMetadata: isTypescript,
        react,
        // 默认到 emp 里面获取
        // regenerator: {
        //   importPath: require.resolve('regenerator-runtime'),
        // },
      },
    },
  }

  if (!isESM) {
    /**
     * regenerator
     */
    if (swcOptions.jsc) {
      const jscTransform: any = {regenerator: {importPath: require.resolve('regenerator-runtime')}}
      swcOptions.jsc.transform = {...swcOptions.jsc.transform, ...jscTransform}
    }
    /**
     * wait update
     * https://github.com/swc-project/swc/issues/2209
     */
    // swcOptions.env = {
    //   mode: 'usage',
    //   coreJs: '3',
    //   debug: true,
    //   dynamicImport: true,
    //   targets: {
    //     chrome: '58',
    //     ie: '11',
    //   },
    // }
  }
  //
  try {
    const {code, map} = build.sync ? transformSync(source, swcOptions) : await transform(source, swcOptions)
    // logger.info('code', JSON.stringify(swcOptions, null, 2))
    done(null, code, map && JSON.parse(map))
  } catch (e) {
    done(e as Error)
  }
}
export default SWCLoader
