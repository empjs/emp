import webpack from 'webpack'
import dts, {DTSTLoadertype} from './dtsEmitFile'
async function DTSloader(this: webpack.LoaderContext<DTSTLoadertype>, source: string) {
  // const done = this.async()
  const options = this.getOptions()
  dts.setup(this, options)
  //禁止缓存
  this.cacheable(false)
  dts.emit()
  return source
}

export default DTSloader
