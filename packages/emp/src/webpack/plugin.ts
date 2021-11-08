import wpChain from 'src/helper/wpChain'
import webpack from 'webpack'
import FederatedStatsPlugin from 'webpack-federated-stats-plugin'
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'
import store from 'src/helper/store'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export const wpPlugin = () => {
  const config: any = {
    plugin: {
      prefetch: {
        plugin: webpack.AutomaticPrefetchPlugin,
        args: [{}],
      },
      html: {
        plugin: HtmlWebpackPlugin,
        args: [store.wpo.plugins?.htmlWebpackPlugin],
      },
    },
  }
  if (store.config.moduleFederation) {
    config.mf = {
      plugin: webpack.container.ModuleFederationPlugin,
      args: [{filename: 'emp.js'}],
    }
    config.mfStats = {
      plugin: FederatedStatsPlugin,
      args: [{filename: 'emp.json'}],
    }
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
