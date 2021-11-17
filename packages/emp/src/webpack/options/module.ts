import store from 'src/helper/store'
import path from 'path'
import wpChain from 'src/helper/wpChain'
import {vCompare} from 'src/helper/utils'

type ReactRuntimeType = 'automatic' | 'classic'
class WpModuleOptions {
  reactRuntime?: ReactRuntimeType
  constructor() {}
  async setup() {
    if (!store.config.reactRuntime) {
      this.checkReactVersion()
    } else {
      this.reactRuntime = store.config.reactRuntime
    }
    this.setScriptReactLoader()
  }
  private checkReactVersion() {
    const pkg = require(path.resolve(store.root, 'package.json'))
    const version = pkg.dependencies.react || pkg.devDependencies.react
    if (version) {
      this.reactRuntime = vCompare(version, '17') > -1 ? 'automatic' : 'classic'
    }
  }
  public swcLoader() {
    return {
      swc: {
        loader: store.empResolve(path.resolve(store.empSource, 'webpack/loader/swc')),
        options: {},
      },
    }
  }
  private setScriptReactLoader() {
    const isDev = store.config.mode === 'development'
    //const isAntd = pkg.dependencies.antd || pkg.devDependencies.antd ? true : false
    // 增加插件支持
    if (isDev && store.config.server.hot && !!this.reactRuntime)
      wpChain.plugin('reactRefresh').use(require('@pmmmwh/react-refresh-webpack-plugin'))
  }
}

export default WpModuleOptions
