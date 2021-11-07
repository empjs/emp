const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const paths = {
  // Source files
  src: path.resolve(__dirname, './src'),

  // Production build files
  build: path.resolve(__dirname, './dist'),

  // Static files that get copied to build folder
  public: path.resolve(__dirname, './public'),
}

module.exports = {
  // Where webpack looks to start building the bundle
  entry: [paths.src + '/index.ts'],

  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    publicPath: '/',
  },

  // Customize the webpack build process
  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),

    // Copies files from target to destination folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public,
          to: 'assets',
          globOptions: {
            ignore: ['*.DS_Store'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),

    // Generates an HTML file from a template
    // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
    new HtmlWebpackPlugin({
      title: 'webpack Boilerplate',
      favicon: paths.src + '/favicon.ico',
      template: paths.src + '/index.html', // template file
      filename: 'index.html', // output file
    }),
  ],

  // Determine how modules within the project are treated
  module: {
    rules: [
      // JavaScript: Use Babel to transpile JavaScript files
      //   {test: /\.js$/, use: ['babel-loader']},
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: [
          {
            loader: '@efox/swc-loader',
            options: {
              jsc: {
                // minify: {
                //   compress: false,
                // },
                target: 'es2015',
                externalHelpers: false,
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                    importSource: 'react',
                    // refresh: true,
                    development: true,
                    useBuiltins: false,
                  },
                },
              },
            },
          },
        ],
      },
    ],
  },

  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      '@': paths.src,
      assets: paths.public,
    },
  },
  // Set the mode to development or production
  mode: 'development',

  // Control how source maps are generated
  devtool: 'inline-source-map',

  // Spin up a server for quick development
  devServer: {
    historyApiFallback: true,
    static: paths.public,
    // open: true,
    compress: true,
    // hot: true,
    port: 8080,
  },
}
