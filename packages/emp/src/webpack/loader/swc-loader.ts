import path from 'path'
import store from 'src/helper/store'
export default () => {
  return {
    swc: {
      loader: store.empResolve(path.resolve(store.empSource, 'webpack/loader/swc')),
      options: store.config.build,
    },
  }
}
