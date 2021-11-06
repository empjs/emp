import webpack from 'webpack'
import {transform, transformSync} from '@swc/core'
import {SWCLoaderOptions} from './swcType'

async function SWCLoader(this: webpack.LoaderContext<SWCLoaderOptions>, source: string) {
  const done = this.async()
  const options = this.getOptions()
  // console.log('options', options)
  //
  options.sourceMaps = typeof options.sourceMaps !== 'undefined' ? options.sourceMaps : this.sourceMap
  options.sourceFileName = typeof options.sourceFileName !== 'undefined' ? options.sourceFileName : this.resourcePath
  // console.log('self', 'sourceMap', this.sourceMap, 'resourcePath', this.resourcePath)
  //
  try {
    const {code, map} = options.sync ? transformSync(source, options) : await transform(source, options)
    // console.log('sourceMaps', map)
    done(null, code, map && JSON.parse(map))
  } catch (e) {
    done(e as Error)
  }
}
export default SWCLoader
