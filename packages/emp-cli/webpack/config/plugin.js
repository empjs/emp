const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
// const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const webpack = require('webpack')
const {resolveApp, getPaths, cachePaths} = require('../../helpers/paths')
const paths = getPaths()
const {TuneDtsPlugin} = require('@efox/emp-tune-dts-plugin')
const path = require('path')
const fs = require('fs')
const ESLintPlugin = require('eslint-webpack-plugin')
const webpackbar = require('webpackbar')
const Dotenv = require('dotenv-webpack')
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
      dotenv: {
        plugin: Dotenv,
        args: [
          {
            path: resolveApp(`.env${empEnv ? '.' + empEnv : ''}`),
            // path: './some.other.env', // load this now instead of the ones in '.env'
            safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
            allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
            systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
            silent: true, // hide any errors
            defaults: false, // load '.env.defaults' as the default values if empty.
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
  if (progress) {
    conf.plugin.progress = {
      plugin: webpackbar,
      args: [
        {
          color: 'green',
          profile: true,
        },
      ],
    }
  }
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
          async: isDev, // true dev环境下部分错误验证通过
          eslint: {
            enabled: true,
            files: `${paths.appSrc}/**/*.{ts,tsx,js,jsx}`,
          },
          typescript: {
            configFile: tsconfig,
            profile: false,
            typescriptPath: require.resolve('typescript'),
          },
        },
      ],
    }
  } else {
    conf.plugin.eslint = {
      plugin: ESLintPlugin,
      args: [
        {
          extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
          context: paths.appRoot,
          // overrideConfigFile: resolveApp('.eslintrc.js'),
          files: ['src/**/*.{ts,tsx,js,jsx}'],
          eslintPath: require.resolve('eslint'),
          cache: true,
          cacheLocation: cachePaths.eslint,
          fix: true,
          threads: true,
          lintDirtyModulesOnly: false,
        },
      ],
    }
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
  //  hot loader
  /*  if (isDev && hot) {
    conf.plugin.hotload = {
      plugin: webpack.HotModuleReplacementPlugin,
      args: [{}],
    }
  } */
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
