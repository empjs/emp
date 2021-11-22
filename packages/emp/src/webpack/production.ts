import TerserPlugin from 'terser-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import store from 'src/helper/store'
import wpChain from 'src/helper/wpChain'
import {Configuration} from 'webpack'
import {WebpackManifestPlugin} from 'webpack-manifest-plugin'
class WPProduction {
  constructor() {}
  private setCommon() {
    const config: Configuration = {
      mode: 'production',
      devtool: store.config.build.sourcemap ? 'source-map' : false, //Recommended
      performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      },
      optimization: {
        chunkIds: store.config.build.chunkIds || 'deterministic', // deterministic 在不同的编译中不变的短数字 id。有益于长期缓存。在生产模式中会默认开启。
        minimize: store.config.build.minify,
        // runtimeChunk: 'single', // 影响 MF 执行
      },
    }
    wpChain.merge(config)
  }
  private setCopy() {
    const wpcConfig = {
      plugin: {
        copy: {
          plugin: CopyWebpackPlugin,
          args: [
            {
              patterns: [
                {
                  from: store.publicDir.replace(/\\/g, '/'),
                  to: store.outDir.replace(/\\/g, '/'),
                  globOptions: {
                    // 加入 paths.template 避免被重置
                    ignore: ['*.DS_Store'],
                  },
                  noErrorOnMissing: true,
                },
              ],
            },
          ],
        },
      },
    }
    wpChain.merge(wpcConfig)
  }
  setMinify() {
    if (store.config.build.minify === true) {
      wpChain.optimization.minimizer('TerserPlugin').use(TerserPlugin, [
        {
          minify: TerserPlugin.swcMinify,
          terserOptions: {
            compress: false,
          },
        },
      ] as any)
    }
  }
  setManifest() {
    const options = store.config.base ? {publicPath: store.config.base} : {}
    wpChain.plugin('WebpackManifestPlugin').use(WebpackManifestPlugin, [options])
  }
  async setup() {
    //common
    this.setCommon()
    // copy
    this.setCopy()
    // minify
    this.setMinify()
    // manifest 比较耗时 TODO 增加 config.build.manifest
    // this.setManifest()
  }
}
export default WPProduction
