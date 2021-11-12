import webpack from 'webpack'
import {transformSync, transform, TransformOptions} from 'esbuild'
import store from 'src/helper/store'
import {logTag} from 'src/helper/logger'
import cssModulesPlugin from 'esbuild-css-modules-plugin'
//
const {build} = store.config
//
console.log('\n')
logTag('esbuild compile.', 'green')

async function ESBUILDLoader(this: webpack.LoaderContext<TransformOptions>, content: string, map: string, meta: any) {
  const done = this.async()
  const options = this.getOptions()
  //
  const isCss = ['.css'].some(p => this.resourcePath.endsWith(p))
  console.log(this.resourcePath, isCss)
  if (!isCss) {
    done(null, content, map)
    return
  }
  //
  const esbuildOptions: TransformOptions = {
    sourcemap: this.sourceMap,
    sourcefile: this.resourcePath,
    ...options,
    target: options.target ?? 'es2015',
    loader: options.loader ?? 'js',
  }

  //
  try {
    const {code, map} = build.sync ? transformSync(content, esbuildOptions) : await transform(content, esbuildOptions)
    // console.log('code', JSON.stringify(esbuildOptions, null, 2))
    done(null, code, map && JSON.parse(map))
  } catch (e) {
    done(e as Error)
  }
}
export default ESBUILDLoader
