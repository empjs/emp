import type webpack from 'webpack'
import {TransformConfig, Options, JscConfig, transformSync, transform} from '@swc/core'
import {ResovleConfig} from '@efox/emp'

class SWCOpt {
  isTypescript = false
  isReact = false
  config: ResovleConfig
  constructor(options: ResovleConfig) {
    this.config = options
  }
  resetType(isTypescript: boolean, isReact: boolean) {
    this.isReact = isReact
    this.isTypescript = isTypescript
  }
  get parser(): JscConfig['parser'] {
    if (this.isTypescript) {
      return {
        syntax: 'typescript',
        tsx: this.config.build.jsToJsx || this.isReact,
        decorators: true,
        dynamicImport: true, //
      }
    }
    return {
      syntax: 'ecmascript',
      jsx: this.config.build.jsToJsx || this.isReact,
      decorators: true,
      decoratorsBeforeExport: false,
    }
  }
  get react(): TransformConfig['react'] {
    const isDev = this.config.mode === 'development'
    return this.isReact
      ? {
          runtime: this.config.reactRuntime || 'classic',
          refresh: isDev,
          development: isDev,
          useBuiltins: false,
        }
      : undefined
  }
}
/**
 * SWCLoader
 * @param this
 * @param source
 */
async function SWCLoader(
  this: webpack.LoaderContext<ResovleConfig>,
  source: string,
  // inputSourceMap: true,
) {
  const done = this.async()
  const config = this.getOptions()
  const swcOpt = new SWCOpt(config)
  //
  const isESM = !['es3', 'es5'].includes(config.build.target)
  //
  const isTypescript = ['.ts', '.tsx'].some(p => this.resourcePath.endsWith(p))
  const isReact = ['.jsx', '.tsx', '.svg'].some(p => this.resourcePath.endsWith(p))
  // const isVue = this.resourcePath.endsWith('.vue')
  // if (isVue) {
  //   isTypescript = true
  //   isReact = false
  // }
  swcOpt.resetType(isTypescript, isReact)
  const {parser, react} = swcOpt
  const swcOptions: Options = {
    sourceFileName: this.resourcePath,
    sourceMaps: this.sourceMap,
    jsc: {
      target: config.build.target,
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
  if (config.build.plugin) swcOptions.plugin = config.build.plugin

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
    const {code, map} = config.build.sync ? transformSync(source, swcOptions) : await transform(source, swcOptions)
    // logger.info('code', JSON.stringify(swcOptions, null, 2))
    done(null, code, map && JSON.parse(map))
  } catch (e) {
    done(e as Error)
  }
}
export default SWCLoader
