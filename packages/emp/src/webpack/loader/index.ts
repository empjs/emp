import store from 'src/helper/store'
export default () => {
  const compilerTypeName = store.config.compile.compileType
  const compilerLoader = store.config.compile.loader()
  return {
    config: {[compilerTypeName]: compilerLoader},
    type: compilerTypeName,
    loader: compilerLoader,
  }
}
