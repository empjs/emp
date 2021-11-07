import wpChain from 'src/helper/wpChain'
import webpack from 'webpack'
import FederatedStatsPlugin from 'webpack-federated-stats-plugin'
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'
import store from 'src/helper/store'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import wpPluginOptions from 'src/webpack/options/plugin'
export const wpPlugin = () => {
  const config: any = {
    plugin: {
      prefetch: {
        plugin: webpack.AutomaticPrefetchPlugin,
        args: [{}],
      },
      mf: {
        plugin: webpack.container.ModuleFederationPlugin,
        args: [{filename: 'emp.js'}],
      },
      mfStats: {
        plugin: FederatedStatsPlugin,
        args: [{filename: 'emp.json'}],
      },
      html: {
        plugin: HtmlWebpackPlugin,
        args: [wpPluginOptions.htmlWebpackPlugin],
      },
    },
  }
  // progress
  if (store.cliOptions.progress) {
    config.plugin.progress = {
      plugin: webpack.ProgressPlugin,
      args: [
        {
          activeModules: false,
          entries: true,
          handler(percentage: any, message: any, ...args: any[]) {
            console.info(Math.round(percentage * 100), message, ...args)
          },
          modules: true,
          modulesCount: 5000,
          profile: true,
          dependencies: true,
          dependenciesCount: 10000,
          percentBy: 'modules',
        },
      ],
    }
  }
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
