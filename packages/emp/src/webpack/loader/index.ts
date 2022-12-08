import store from 'src/helper/store'
import {CompileLoaderNameType, CompileLoaderCallBackType} from 'src/types'
export default (): LoaderType => {
  const compilerTypeName = store.config.compile.compileType
  const compilerLoader = store.config.compile.loader(store.config)
  return {
    config: {[compilerTypeName]: compilerLoader},
    type: compilerTypeName,
    loader: compilerLoader,
  }
}

export interface LoaderType {
  config: {[x: string]: CompileLoaderCallBackType}
  type: CompileLoaderNameType
  loader: CompileLoaderCallBackType
}
