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
  //
  options.sourceMaps = typeof options.sourceMaps !== 'undefined' ? options.sourceMaps : this.sourceMap
  options.sourceFileName = typeof options.sourceFileName !== 'undefined' ? options.sourceFileName : this.resourcePath
  delete options.sync
  //
  try {
    const {code, map} = options.sync ? transformSync(source, options) : await transform(source, options)
    done(null, code, map && JSON.parse(map))
  } catch (e) {
    done(e as Error)
  }
}
export default SWCLoader
