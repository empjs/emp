import store from 'src/helper/store'
import fs from 'fs-extra'
import {SWCLoaderOptions} from '@efox/swc-loader/types/swcType'
class WpModuleOptions {
  public swcLoader
  constructor() {
    this.swcLoader = this.setSwcLoader()
  }
  private setSwcLoader() {
    const isDev = store.wpo.mode === 'development'
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
          react: {
            runtime: 'automatic',
            importSource: 'react',
            //TODO 增加 react-refresh 支持
            // refresh: isDev,
            development: isDev,
            useBuiltins: false,
          },
        },
      },
    }
    return swcOptions
  }
}

export default WpModuleOptions
