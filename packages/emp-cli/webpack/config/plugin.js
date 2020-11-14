const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
// const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const webpack = require('webpack')
const {resolveApp, getPaths} = require('../../helpers/paths')
const paths = getPaths()
const {TuneDtsPlugin} = require('@efox/emp-tune-dts-plugin')
const path = require('path')
const fs = require('fs')
const ESLintPlugin = require('eslint-webpack-plugin')
//
module.exports = (env, config, {analyze, empEnv, ts, progress, createName, createPath, hot}) => {
  const isDev = env === 'development'
  const conf = {
    plugin: {
      env: {
        plugin: webpack.EnvironmentPlugin,
        args: [
          {
            MODE_ENV: env,
            EMP_ENV: empEnv,
          },
        ],
      },
      clean: {plugin: CleanWebpackPlugin, args: []},
      html: {
        plugin: HtmlWebpackPlugin,
        args: [
          {
            title: 'EMP',
            template: paths.template,
            favicon: paths.favicon,
            files: {
              css: [],
              js: [],
            },
            minify: !isDev
              ? {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                }
              : false,
          },
        ],
      },

      mf: {
        plugin: ModuleFederationPlugin,
        args: [{}],
      },
    },
  }
  // progress
  /* if (progress) {
    conf.plugin.progress = {
      plugin: webpack.ProgressPlugin,
      args: [
        {
          handler(percentage, message, ...args) {
            console.log(Math.floor(percentage * 100) + '%', message, args)
          },
        },
      ],
    }
  } */
  // ts ForkTsCheckerWebpackPlugin
  const tsconfig = resolveApp('tsconfig.json')
  if (fs.existsSync(tsconfig)) {
    conf.plugin.ts = {
      plugin: ForkTsCheckerWebpackPlugin,
      args: [
        {
          async: false, // true dev环境下部分错误验证通过
          // eslint: true,
          checkSyntacticErrors: true,
          tsconfig,
          silent: true,
        },
      ],
    }
  }
  config.plugin.eslint = {
    plugin: ESLintPlugin,
    args: [
      {
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
        // formatter: require.resolve('react-dev-utils/eslintFormatter'),
        eslintPath: require.resolve('eslint'),
        context: paths.appSrc,
        cache: false,
        cwd: paths.appRoot,
        resolvePluginsRelativeTo: __dirname,
      },
    ],
  }
  // analyzer
  if (analyze) {
    conf.plugin.analyzer = {
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
  // react hot loader
  /* if (hot && isDev) {
    conf.plugin.reacthotloader = {
      plugin: ReactRefreshWebpackPlugin,
      args: [{}],
    }
  } */
  /** create d.ts */
  // dev 和 build 都生成 d.ts
  if (ts) {
    createName = createName || 'index.d.ts'
    createPath = createPath ? resolveApp(createPath) : resolveApp('dist')
    conf.plugin.tunedts = {
      plugin: TuneDtsPlugin,
      args: [
        {
          output: path.join(createPath, createName),
          path: createPath,
          name: createName,
          isDefault: true,
        },
      ],
    }
  }
  config.merge(conf)
}
