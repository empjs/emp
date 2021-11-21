import webpack from 'webpack'
import {ResovleConfig} from 'src/config'
// 可参考 https://github.com/ruanyl/dts-loader/blob/master/packages/dts-loader/src/index.ts
async function DTSloader(this: webpack.LoaderContext<ResovleConfig>, source: string) {
  const done = this.async()
  const options = this.getOptions()
}

export default DTSloader
