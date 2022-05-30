// import path from 'path'
import {empStore as store, ResovleConfig} from '@efox/emp'
import TramsformImport from './swc-plugin-transform-import'

export default () => {
  const pkg = store.pkg
  const isAntd = pkg.dependencies.antd || pkg.devDependencies.antd ? true : false
  const options = store.config.build as ResovleConfig['build']
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
    loader: require.resolve('./swc'),
    options,
  }
}
