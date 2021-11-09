import store from 'src/helper/store'
import fs from 'fs-extra'
import {SWCLoaderOptions} from '@efox/swc-loader/types/swcType'
class WpModuleOptions {
  public swcLoader
  // public esbuildLoader
  constructor() {
    this.swcLoader = this.setSwcLoader()
    // esbuild 适合直接使用 不支持 Module Federation
    // this.esbuildLoader = this.setEsbuildLoader()
  }
  /* private setEsbuildLoader() {
    return {}
  } */
  private setSwcLoader() {
    const isDev = store.wpo.mode === 'development'
    const swcOptions: SWCLoaderOptions = {
      sourceMaps: true,
      // sync: true,
      jsc: {
        // minify: {
        //   compress: false,
        // },
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
