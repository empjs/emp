import webpack from 'webpack'
import {transform, TransformConfig, transformSync, Options, JscConfig} from '@swc/core'
import type {ResovleConfig} from 'types/index'
import {vCompare} from './helper'
//
import path from 'path'
const root = process.cwd()
const pkg = require(path.resolve(root, 'package.json'))
const reactVersion = pkg.dependencies.react || pkg.devDependencies.react
//const isAntd = pkg.dependencies.antd || pkg.devDependencies.antd ? true : false
let isReact17 = false
if (reactVersion) isReact17 = vCompare(reactVersion, '17') > -1
async function SWCLoader(
  this: webpack.LoaderContext<ResovleConfig>,
  source: string,
  // inputSourceMap: true,
) {
  const done = this.async()
  const options = this.getOptions()
  //
  const isTypescript = ['.ts', '.tsx'].some(p => this.resourcePath.endsWith(p))
  const isReact = ['.jsx', '.tsx', '.svg'].some(p => this.resourcePath.endsWith(p))
  const isDev = options.mode === 'development'
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
    sourceMaps: typeof options.build.sourcemap !== 'undefined' ? options.build.sourcemap : this.sourceMap,
    jsc: {
      target: options.build.target,
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
    const {code, map} = options.build.sync ? transformSync(source, swcOptions) : await transform(source, swcOptions)
    // console.log('code', swcOptions)
    done(null, code, map && JSON.parse(map))
  } catch (e) {
    done(e as Error)
  }
}
export default SWCLoader
