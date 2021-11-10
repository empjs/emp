import wpChain from 'src/helper/wpChain'
import webpack from 'webpack'
import FederatedStatsPlugin from 'webpack-federated-stats-plugin'
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'
import store from 'src/helper/store'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import Dotenv from 'dotenv-webpack'
// import logger from 'src/helper/logger'
// import WebpackBarPlugin from 'webpackbar'

export const wpPlugin = () => {
  const config: any = {
    plugin: {
      define: {
        plugin: webpack.DefinePlugin,
        args: [store.wpo.plugins?.definePlugin],
      },
      dotenv: {
        plugin: Dotenv,
        args: [
          {
            path: store.resolve(`.env${store.config.mode ? '.' + store.config.mode : ''}`),
            // path: './some.other.env', // load this now instead of the ones in '.env'
            safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
            allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
            systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
            silent: true, // hide any errors
            defaults: false, // load '.env.defaults' as the default values if empty.
          },
        ],
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
