import TerserPlugin from 'terser-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import store from 'src/helper/store'
import wpChain from 'src/helper/wpChain'
import {Configuration} from 'webpack'
import {WebpackManifestPlugin} from 'webpack-manifest-plugin'
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin'
import logger from 'src/helper/logger'
// import type {SquooshOptionType} from 'src/types/squoosh'
class WPProduction {
  constructor() {}
  private setCommon() {
    const config: Configuration = {
      mode: 'production',
      devtool: store.config.build.sourcemap ? 'source-map' : false, //Recommended
      performance: {
        hints: 'warning',
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      },
      optimization: {
        chunkIds: store.config.build.chunkIds || 'deterministic', // deterministic 在不同的编译中不变的短数字 id。有益于长期缓存。在生产模式中会默认开启。
        minimize: store.config.build.minify ? true : false,
        // runtimeChunk: 'single', // 影响 MF 执行
        // ===[暂时观察有效性]===============
        // splitChunks: {
        //   cacheGroups: {
        //     //打包公共模块
        //     commons: {
        //       //initial表示提取入口文件的公共部分
        //       chunks: 'initial',
        //       //表示提取公共部分最少的文件数
        //       minChunks: 2,
        //       //表示提取公共部分最小的大小
        //       minSize: 0,
        //       //提取出来的文件命名
        //       name: 'commons',
        //     },
        //   },
        // },
        // =================
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
    const minOptions = store.config.build.minOptions || {}

    if (store.config.build.minify) {
      let options: any = {
        minify: TerserPlugin.terserMinify,
        extractComments: false,
        terserOptions: {
          // compress: false,
          format: {
            comments: false,
          },
          ...minOptions,
        },
      }

      if (store.config.build.minify === 'swc' && store.config.compile.compileType === 'swc') {
        options = {
          minify: TerserPlugin.swcMinify,
          extractComments: false,
          terserOptions: {
            // compress: false,
            format: {
              comments: false,
            },
            ...minOptions,
          },
        }
      } else if (store.config.compile.compileType === 'esbuild') {
        options = {
          minify: TerserPlugin.esbuildMinify,
          extractComments: false,
          terserOptions: {
            format: 'esm',
            ...minOptions,
          },
        }
      }
      logger.debug('store.config.build.minify', store.config.build.minify, store.config.debug)
      wpChain.optimization.minimizer('TerserPlugin').use(TerserPlugin, [options] as any)
    }
  }
  setImageMin() {
    if (store.config.build.imageMin) {
      const options = {}
      wpChain.optimization.minimizer('ImageMinimizerPlugin').use(ImageMinimizerPlugin, [
        {
          minimizer: {
            implementation: ImageMinimizerPlugin.squooshMinify,
            options,
          },
        },
      ])
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
    this.setImageMin()
    // manifest 比较耗时 TODO 增加 config.build.manifest
    // this.setManifest()
  }
}
export default WPProduction
