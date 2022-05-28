import path from 'path'
import {RquireBuildOptions} from 'src/config/build'
import store from 'src/helper/store'
import TramsformImport from './swc-plugin-transform-import'

export default () => {
  const pkg = store.pkg
  const isAntd = pkg.dependencies.antd || pkg.devDependencies.antd ? true : false
  const options = store.config.build as RquireBuildOptions
  if (!options.plugin && isAntd && store.config.moduleTransform.antdTransformImport) {
    options.plugin = (m: any) => {
      const rs = new TramsformImport({
        antd: {
          transform: 'antd/es/${member}',
          style: true,
        },
      }).visitProgram(m)
      return rs
    }
  }
  return {
    swc: {
      loader: store.empResolve(path.resolve(store.empSource, 'webpack/loader/swc')),
      options,
    },
  }
}
