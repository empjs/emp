import {LoaderContext} from 'webpack'
import {transform, transformSync} from 'esbuild'
import {ESBUILDLoaderOptions} from './types'

async function SWCLoader(
  this: LoaderContext<ESBUILDLoaderOptions>,
  source: string,
  // inputSourceMap: true,
) {
  const done = this.async()
  const options = this.getOptions()
  const isSync = options.sync
  //
  // options.target = '2015'
  options.loader = 'tsx'
  // options.jsx = 'preserve'
  options.sourcemap = options.sourcemap || this.sourceMap
  options.sourcefile = options.sourcefile || this.resourcePath
  // options.sourceMaps = typeof options.sourceMaps !== 'undefined' ? options.sourceMaps : this.sourceMap
  // options.sourceFileName = typeof options.sourceFileName !== 'undefined' ? options.sourceFileName : this.resourcePath
  delete options.sync
  // console.log('options', options)
  //
  try {
    const {code, map} = isSync ? transformSync(source, options) : await transform(source, options)
    done(null, code, map && JSON.parse(map))
  } catch (e) {
    done(e as Error)
  }
}
export default SWCLoader
