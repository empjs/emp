// webpack.config.js
let path = require('path')
let webpack = require('webpack')
let pk = require('./package.json')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = [
  {
    // 第一份生产环境的压缩代码
    mode: 'production',
    entry: './src/index.ts', // 入口文件呀
    module: {
      rules: [
        // ts loader
        {
          test: /\.ts?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      // 解析文件呀
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'index.js',
      // library: 'singlemobx6',
      libraryTarget: 'umd',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CompressionPlugin({
        deleteOriginalAssets: false,
      }),
    ],
  },
  // {
  //   // 第二份开发环境的不压缩代码
  //   mode: 'development',
  //   entry: './src/index.ts',
  //   module: {
  //     rules: [
  //       // 如果只是正常的 js 构建，请改成 babel-loader 啦
  //       {
  //         test: /\.tsx?$/,
  //         use: 'ts-loader',
  //         exclude: /node_modules/,
  //       },
  //     ],
  //   },
  //   resolve: {
  //     extensions: ['.tsx', '.ts', '.js'],
  //   },
  //   output: {
  //     path: path.join(__dirname, 'build'),
  //     filename: 'singlemobx.js',
  //     library: 'singlemobx',
  //     libraryTarget: 'commonjs-module',
  //   },
  //   devtool: 'inline-source-map',
  // },
]
