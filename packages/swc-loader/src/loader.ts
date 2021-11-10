import webpack from 'webpack'
import {transform, transformSync} from '@swc/core'
import {SWCLoaderOptions} from './swcType'

async function SWCLoader(
  this: webpack.LoaderContext<SWCLoaderOptions>,
  source: string,
  // inputSourceMap: true,
) {
  const done = this.async()
  const options = this.getOptions()
  const isSync = options.sync
  const isTypescript = ['.ts', '.tsx'].some(p => this.resourcePath.endsWith(p))
  const isReact = ['.jsx', '.tsx'].some(p => this.resourcePath.endsWith(p))
  console.log({isTypescript, isReact})
  //
  options.sourceMaps = typeof options.sourceMaps !== 'undefined' ? options.sourceMaps : this.sourceMap
  options.sourceFileName = typeof options.sourceFileName !== 'undefined' ? options.sourceFileName : this.resourcePath
  delete options.sync
  //
  try {
    const {code, map} = isSync ? transformSync(source, options) : await transform(source, options)
    // console.log('code', code)
    done(null, code, map && JSON.parse(map))
  } catch (e) {
    done(e as Error)
  }
}
export default SWCLoader
