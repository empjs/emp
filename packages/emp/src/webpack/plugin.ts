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
  /* config.plugin.progress = {
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
  } */
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

  wpChain.merge(config)
}
