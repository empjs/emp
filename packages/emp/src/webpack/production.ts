import TerserPlugin from 'terser-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import store from 'src/helper/store'
import wpChain from 'src/helper/wpChain'
import {Configuration} from 'webpack'
export const wpProduction = () => {
  const config: Configuration = {
    mode: 'production',
    devtool: store.config.build.sourcemap ? 'source-map' : false, //Recommended
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    optimization: {
      chunkIds: 'named',
      minimize: store.config.build.minify,
      // runtimeChunk: 'single', // 影响 MF 执行
    },
  }
  wpChain.merge(config)
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
      css: {
        plugin: MiniCssExtractPlugin,
        args: [
          {
            ignoreOrder: true,
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name].[contenthash:8].chunk.css',
          },
        ],
      },
    },
  }
  wpChain.merge(wpcConfig)
  //
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
