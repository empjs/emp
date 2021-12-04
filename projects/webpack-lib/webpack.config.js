const TerserPlugin = require('terser-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const webpack = require('webpack')
const pkg = require('./package.json')
const path = require('path')
const src = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'dist')
module.exports = (e, {mode}) => {
  return {
    mode,
    resolve: {
      modules: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        src,
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    entry: {
      'bd-svga': path.resolve(src, 'index.ts'),
    },
    output: {
      publicPath: '/',
      path: dist,
      filename: 'index.js',
      library: {
        name: 'bd-svga',
        type: 'umd',
      },
      environment: {
        arrowFunction: false,
        bigIntLiteral: false,
        const: false,
        destructuring: false,
        forOf: false,
        dynamicImport: false,
        module: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      useBuiltIns: 'entry',
                      // debug: true,
                      corejs: 3,
                      loose: true,
                    },
                  ],
                  '@babel/preset-typescript',
                ],
                plugins: [
                  [
                    '@babel/plugin-transform-runtime',
                    {
                      corejs: false,
                      helpers: true,
                      version: require('@babel/runtime/package.json').version,
                      regenerator: true,
                      useESModules: false,
                      absoluteRuntime: true,
                    },
                  ],
                  ['@babel/plugin-proposal-decorators', {legacy: true}],
                  ['@babel/plugin-proposal-class-properties', {loose: true}],
                ],
              },
            },
          ],
        },
      ],
    },
    optimization: {
      // chunkIds: 'named',
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        'import.meta.env.MODE': JSON.stringify(mode),
        'import.meta.env.PACKAGE_VERSION': JSON.stringify(pkg.version),
      }),
    ],
  }
}
