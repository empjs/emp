import store from 'src/helper/store'
// import fs from 'fs-extra'
import {SWCLoaderOptions} from '@efox/swc-loader/types/swcType'
import {vCompare} from 'src/helper/utils'
class WpModuleOptions {
  public swcLoader
  constructor() {
    this.swcLoader = this.setSwcLoader()
  }
  private setSwcLoader() {
    const pkg = require(store.resolve('package.json'))
    const isDev = store.wpo.mode === 'development'
    const reactVersion = pkg.dependencies.react || pkg.devDependencies.react
    // const isAntd = pkg.dependencies.antd || pkg.devDependencies.antd ? true : false
    let isReact17 = false
    let react = {}
    if (reactVersion) {
      isReact17 = vCompare(reactVersion, '17') > -1
      react = {
        runtime: isReact17 ? 'automatic' : 'classic',
        // throwIfNamespace: true,
        // importSource: 'react',
        //TODO 增加 react-refresh 支持
        // refresh: isDev,
        development: isDev,
        useBuiltins: false,
      }
    }
    const swcOptions: SWCLoaderOptions = {
      sourceMaps: true,
      // sync: true,
      jsc: {
        target: store.config.build.target,
        externalHelpers: false,
        parser: {
          syntax: 'typescript',
          tsx: true,
        },
        transform: {
          legacyDecorator: true,
          react,
        },
      },
    }
    return swcOptions
  }
}

export default WpModuleOptions
