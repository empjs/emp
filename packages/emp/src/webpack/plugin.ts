import wpChain from 'src/helper/wpChain'
import webpack from 'webpack'
// import FederatedStatsPlugin from 'webpack-federated-stats-plugin'
// import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'
import store from 'src/helper/store'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import Dotenv from 'dotenv-webpack'
// import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
// import ESLintPlugin from 'eslint-webpack-plugin'
import path from 'path'
import fs from 'fs-extra'
export const wpPlugin = () => {
  const isDev = store.wpo.mode === 'development'

  const config: any = {
    plugin: {
      define: {
        plugin: webpack.DefinePlugin,
        args: [store.wpo.plugins?.definePlugin],
      },
      dotenv: {
        plugin: Dotenv,
        args: [store.wpo.plugins.dotenv],
      },
      html: {
        plugin: HtmlWebpackPlugin,
        args: [store.wpo.plugins?.htmlWebpackPlugin],
      },
      //加了不热更
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
  if (isDev && store.wpo.modules.react) {
    config.plugin.reactRefresh = {
      plugin: require('@pmmmwh/react-refresh-webpack-plugin'),
      args: [],
    }
  }
  if (store.config.moduleFederation) {
    config.plugin.mf = {
      plugin: webpack.container.ModuleFederationPlugin,
      args: [store.wpo.plugins?.moduleFederation],
    }
    config.plugin.mfStats = {
      plugin: require('webpack-federated-stats-plugin'),
      args: [{filename: 'emp.json'}],
    }
  }
  // 加了会出bug
  // if (store.cliOptions.progress) {
  config.plugin.progress = {
    plugin: webpack.ProgressPlugin,
    args: [{}],
  }
  // }
  //analyzer
  if (store.cliOptions.analyze) {
    config.plugin.analyzer = {
      plugin: require('webpack-bundle-analyzer'),
      args: [
        {
          // analyzerMode: 'static',
          reportFilename: 'report.html',
          openAnalyzer: true,
        },
      ],
    }
  }
  if (store.config.jsCheck) {
    // ts check
    const tsconfigJson = store.resolve('tsconfig.json')
    if (fs.existsSync(tsconfigJson)) {
      config.plugin.tsCheck = {
        plugin: require('fork-ts-checker-webpack-plugin'),
        args: [
          {
            async: isDev, // true dev环境下部分错误验证通过
            eslint: {
              enabled: true,
              files: `${store.appSrc}/**/*.{ts,tsx,js,jsx}`,
            },
            typescript: {
              configFile: tsconfigJson,
              profile: false,
              typescriptPath: 'typescript',
              // configOverwrite: {
              //   compilerOptions: {skipLibCheck: true},
              // },
            },
            // logger: {issues: 'console'},
          },
        ],
      }
    } else {
      config.plugin.eslint = {
        plugin: require('eslint-webpack-plugin'),
        args: [
          {
            extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
            context: store.root,
            // overrideConfigFile: resolveApp('.eslintrc.js'),
            files: ['src/**/*.{ts,tsx,js,jsx}'],
            // eslintPath: require.resolve('eslint'),
            cache: true,
            cacheLocation: path.resolve(store.config.cacheDir, 'eslint'),
            fix: true,
            threads: true,
            lintDirtyModulesOnly: false,
          },
        ],
      }
    }
  }

  wpChain.merge(config)
}
