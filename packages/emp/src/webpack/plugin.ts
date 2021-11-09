import wpChain from 'src/helper/wpChain'
import webpack from 'webpack'
import FederatedStatsPlugin from 'webpack-federated-stats-plugin'
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'
import store from 'src/helper/store'
import HtmlWebpackPlugin from 'html-webpack-plugin'
// import logger from 'src/helper/logger'
// import WebpackBarPlugin from 'webpackbar'

export const wpPlugin = () => {
  const config: any = {
    plugin: {
      define: {
        plugin: webpack.DefinePlugin,
        args: [store.wpo.plugins?.definePlugin],
      },
      prefetch: {
        plugin: webpack.AutomaticPrefetchPlugin,
        args: [{}],
      },
      html: {
        plugin: HtmlWebpackPlugin,
        args: [store.wpo.plugins?.htmlWebpackPlugin],
      },
      //TODO: 产生复制不了的命令行的bug
      // webpackbar: {
      //   plugin: WebpackBarPlugin,
      //   args: [
      //     {
      //       name: '[EMP]',
      //       // profile: true,
      //       // reporter: true,
      //       // reporters: ['profile'],
      //     },
      //   ],
      // },
    },
  }
  if (store.config.moduleFederation) {
    config.plugin.mf = {
      plugin: webpack.container.ModuleFederationPlugin,
      args: [store.wpo.plugins?.moduleFederation],
    }
    config.plugin.mfStats = {
      plugin: FederatedStatsPlugin,
      args: [{filename: 'emp.json'}],
    }
  }
  // progress
  // if (store.cliOptions.progress) {
  config.plugin.progress = {
    plugin: webpack.ProgressPlugin,
    args: [
      {
        // activeModules: false,
        // entries: true,
        // handler(percentage: any, message: any, ...args: any[]) {
        //   logger.info(Math.round(percentage * 100), message, ...args)
        // },
        // modules: true,
        // modulesCount: 5000,
        // profile: true,
        // dependencies: true,
        // dependenciesCount: 10000,
        // percentBy: 'modules',
      },
    ],
  }
  // }
  //analyzer
  if (store.cliOptions.analyze) {
    config.plugin.analyzer = {
      plugin: BundleAnalyzerPlugin,
      args: [
        {
          // analyzerMode: 'static',
          reportFilename: 'report.html',
          openAnalyzer: true,
        },
      ],
    }
  }
  // dts

  wpChain.merge(config)
}
