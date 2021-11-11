import store from 'src/helper/store'
import path from 'path'
import wpChain from 'src/helper/wpChain'
import {vCompare} from 'src/helper/utils'
type pkgType = {
  dependencies: {[key: string]: string | undefined}
  devDependencies: {[key: string]: string | undefined}
  version: string
}
type reactCheckType = {
  version: string | undefined
  isReact17: boolean
}
class WpModuleOptions {
  pkg: pkgType
  react: reactCheckType
  constructor() {
    this.pkg = {dependencies: {}, devDependencies: {}, version: ''}
    this.react = {
      version: undefined,
      isReact17: false,
    }
  }
  async setup() {
    this.setScriptReactLoader()
  }
  private setScriptReactLoader() {
    const pkg = require(path.resolve(store.root, 'package.json'))
    this.pkg = {...this.pkg, ...pkg}
    this.react.version = this.pkg.dependencies.react || this.pkg.devDependencies.react
    const isDev = store.config.mode === 'development'
    //const isAntd = pkg.dependencies.antd || pkg.devDependencies.antd ? true : false
    this.react.isReact17 = false
    if (this.react.version) this.react.isReact17 = vCompare(this.react.version, '17') > -1
    // 增加插件支持
    if (isDev && store.config.server.hot && !!this.react.version)
      wpChain.plugin('reactRefresh').use(require('@pmmmwh/react-refresh-webpack-plugin'))
  }
}

export default WpModuleOptions
