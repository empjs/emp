import webpack from 'webpack'
import {ResovleConfig} from 'src/config'
import {TransformConfig, Options, JscConfig, transformSync, transform} from '@swc/core'
import store from 'src/helper/store'
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
          refresh: isDev, //TODO 增加 react-refresh 支持
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
  this: webpack.LoaderContext<ResovleConfig>,
  source: string,
  // inputSourceMap: true,
) {
  const done = this.async()
  const options = this.getOptions()
  const {build} = options
  //
  const isTypescript = ['.ts', '.tsx'].some(p => this.resourcePath.endsWith(p))
  const isReact = ['.jsx', '.tsx', '.svg'].some(p => this.resourcePath.endsWith(p))
  swcOpt.resetType(isTypescript, isReact)
  const {parser, react} = swcOpt
  const swcOptions: Options & any = {
    sourceFileName: this.resourcePath,
    sourceMaps: this.sourceMap,
    // env: {mode: 'usage'},
    jsc: {
      target: build.target,
      externalHelpers: false,
      parser,
      transform: {
        legacyDecorator: true,
        decoratorMetadata: isTypescript,
        react,
        // 默认到 emp 里面获取
        regenerator: {
          importPath: require.resolve('regenerator-runtime'),
        },
      },
    },
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
