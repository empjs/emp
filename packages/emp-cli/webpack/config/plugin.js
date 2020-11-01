const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const webpack = require('webpack')
const {resolveApp, getPaths} = require('../../helpers/paths')
const paths = getPaths()
const {TuneDtsPlugin} = require('@efox/emp-tune-dts-plugin')
const path = require('path')
const fs = require('fs')
const ESLintPlugin = require('eslint-webpack-plugin')
const typescriptFormatter = require('react-dev-utils/typescriptFormatter')
// const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
// const reactRefreshOverlayEntry = require.resolve('react-dev-utils/refreshOverlayInterop')

//
module.exports = (env, config, {analyze, empEnv, ts, createName, createPath, hot}) => {
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
      progress: {
        plugin: webpack.ProgressPlugin,
        args: [
          {
            // activeModules: false,
            // entries: true,
            // modules: true,
            // modulesCount: 5000,
            // profile: false,
            // dependencies: true,
            // dependenciesCount: 10000,
            // percentBy: null,
            handler(percentage, message, ...args) {
              console.log(Math.floor(percentage * 100) + '%', message, args)
            },
          },
        ],
      },
      mf: {
        plugin: ModuleFederationPlugin,
        args: [{}],
      },
    },
  }
  // ts ForkTsCheckerWebpackPlugin
  const tsconfig = resolveApp('tsconfig.json')
  if (fs.existsSync(tsconfig)) {
    conf.plugin.ts = {
      plugin: ForkTsCheckerWebpackPlugin,
      args: [
        {
          async: true,
          useTypescriptIncrementalApi: true,
          checkSyntacticErrors: true,
          tsconfig,
          // eslint: true,
          silent: true,
          // formatter: !isDev ? undefined : typescriptFormatter,
          formatter: typescriptFormatter,
        },
      ],
    }
  }
  config.plugin.eslint = {
    plugin: ESLintPlugin,
    args: [
      {
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
        formatter: require.resolve('react-dev-utils/eslintFormatter'),
        eslintPath: require.resolve('eslint'),
        context: path.appSrc,
        cache: true,
        cwd: path.appPath,
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
    // console.log('conf.plugin.analyzer===', conf.plugin.analyzer)
  }
  //ModuleScopePlugin
  /* config.plugin.modulescope = {
    plugin: ModuleScopePlugin,
    args: [paths.appSrc, [paths.appPackageJson, reactRefreshOverlayEntry]],
  } */
  // react hot loader
  if (hot && isDev) {
    /* conf.plugin.hotModuleReplacement = {
      plugin: webpack.HotModuleReplacementPlugin,
      args: [],
    } */
    conf.plugin.reacthotloader = {
      plugin: ReactRefreshWebpackPlugin,
      args: [
        {
          /* overlay: {
            entry: webpackDevClientEntry,
            // The expected exports are slightly different from what the overlay exports,
            // so an interop is included here to enable feedback on module-level errors.
            module: reactRefreshOverlayEntry,
            // Since we ship a custom dev client and overlay integration,
            // the bundled socket handling logic can be eliminated.
            sockIntegration: false,
          }, */
        },
      ],
    }
  }
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
