// import path from 'path'
import {empStore as store, ResovleConfig} from '@efox/emp'
// antd5 后切换到 css in js 不需要继续使用该特性
/* import TramsformImport from './swc-plugin-transform-import'
let isAntd = false
try {
  const antd = require('antd')
  if (antd && antd.version) {
    const v = antd.version.split('.')[0]
    if (v && parseInt(v) <= 4) {
      isAntd = true
    }
  }
} catch (e) {
  // console.warn(e)
} */
export default () => {
  // const pkg = store.pkg
  const options = store.config.build as ResovleConfig['build']
  /* if (isAntd && !options.plugin && store.config.moduleTransform.antdTransformImport) {
    options.plugin = (m: any) => {
      const rs = new TramsformImport({
        antd: {
          transform: 'antd/es/${member}',
          style: true,
        },
      }).visitProgram(m)
      return rs
    }
  } */
  return {
    loader: require.resolve('./swc'),
    options,
  }
}
