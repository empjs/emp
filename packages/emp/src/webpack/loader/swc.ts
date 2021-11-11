import webpack from 'webpack'
import {ResovleConfig} from 'src/config'
import {TransformConfig, Options, JscConfig, transformSync, transform} from '@swc/core'
import store from 'src/helper/store'
import {logTag} from 'src/helper/logger'
const isDev = store.config.mode === 'development'
const {isReact17} = store.wpo.modules.react
const {build} = store.config
//
// console.log('\n')
// logTag('swc compile.', 'green')
async function SWCLoader(
  this: webpack.LoaderContext<ResovleConfig>,
  source: string,
  // inputSourceMap: true,
) {
  const done = this.async()
  // const options = this.getOptions()
  //
  const isTypescript = ['.ts', '.tsx'].some(p => this.resourcePath.endsWith(p))
  const isReact = ['.jsx', '.tsx', '.svg'].some(p => this.resourcePath.endsWith(p))

  let react: TransformConfig['react'] = undefined
  if (isReact) {
    react = {
      runtime: isReact17 ? 'automatic' : 'classic',
      refresh: isDev, //TODO 增加 react-refresh 支持
      development: isDev,
      useBuiltins: false,
    }
  }
  // console.log({isTypescript, isReact, isDev})
  let parser: JscConfig['parser'] = {
    syntax: 'ecmascript',
    jsx: isReact,
    decorators: true,
    decoratorsBeforeExport: false,
  }
  if (isTypescript) {
    parser = {
      syntax: 'typescript',
      tsx: isReact,
      decorators: true,
      dynamicImport: true, //
    }
  }
  //
  const swcOptions: Options = {
    sourceFileName: this.resourcePath,
    sourceMaps: typeof build.sourcemap !== 'undefined' ? build.sourcemap : this.sourceMap,
    // env: {mode: 'usage'},
    jsc: {
      target: build.target,
      externalHelpers: false,
      parser,
      transform: {
        legacyDecorator: true,
        decoratorMetadata: isTypescript,
        react,
      },
    },
  }

  //
  try {
    const {code, map} = build.sync ? transformSync(source, swcOptions) : await transform(source, swcOptions)
    // console.log('code', JSON.stringify(swcOptions, null, 2))
    done(null, code, map && JSON.parse(map))
  } catch (e) {
    done(e as Error)
  }
}
export default SWCLoader
