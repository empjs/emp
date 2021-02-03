const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/
const lessRegex = /\.less$/
const lessModuleRegex = /\.module\.less$/
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
module.exports = (env, config) => {
  const isDev = env === 'development'
  const getStyleLoader = (modules = false, preProcessor = {}) => {
    return {
      style: {
        // loader: require.resolve('style-loader'),//
        loader: isDev ? require.resolve('style-loader') : MiniCssExtractPlugin.loader,
      },
      css: {
        loader: require.resolve('css-loader'),
        options: {
          modules: isDev ? {localIdentName: '[path][name]__[local]--[hash:base64:5]'} : modules,
        },
      },
      postcss: {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            hideNothingWarning: true,
            /* plugins: [
              [
                require('cssnano'),
                {
                  preset: [
                    'default',
                    {
                      discardComments: {
                        removeAll: true,
                      },
                    },
                  ],
                },
              ],
            ], */
          },
        },
      },
      ...preProcessor,
    }
  }
  const conf = {
    module: {
      rule: {
        css: {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: {
            ...getStyleLoader(),
          },
        },
        cssModule: {
          test: cssModuleRegex,
          // exclude: cssRegex,
          use: {
            ...getStyleLoader(true),
          },
        },
        sassModule: {
          test: sassModuleRegex,
          // exclude: sassRegex,
          use: {
            ...getStyleLoader(true, {
              sass: {
                loader: require.resolve('sass-loader'),
                options: {
                  implementation: require('sass'),
                  sourceMap: env === 'development',
                },
              },
            }),
          },
        },
        sass: {
          test: sassRegex,
          exclude: sassModuleRegex,
          use: {
            ...getStyleLoader(false, {
              sass: {
                loader: require.resolve('sass-loader'),
                options: {
                  implementation: require('sass'),
                  sourceMap: env === 'development',
                },
              },
            }),
          },
        },
        less: {
          test: lessRegex,
          exclude: lessModuleRegex,
          use: {
            ...getStyleLoader(false, {
              less: {
                loader: require.resolve('less-loader'),
                options: {
                  lessOptions: {javascriptEnabled: true},
                },
              },
            }),
          },
        },
        lessModule: {
          test: lessModuleRegex,
          // exclude: lessRegex,
          use: {
            ...getStyleLoader(true, {
              less: {
                loader: require.resolve('less-loader'),
                /* options: {
                lessOptions: {javascriptEnabled: true},
              }, */
              },
            }),
          },
        },
      },
    },
  }
  //=============== css min
  if (!isDev) {
    config.optimization.minimizer('CssMinimizerPlugin').use(CssMinimizerPlugin, [
      {
        parallel: true,
        sourceMap: false,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: {removeAll: true},
            },
          ],
        },
      },
    ])
    config.plugin('MiniCssExtractPlugin').use(MiniCssExtractPlugin, [
      {
        ignoreOrder: true,
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      },
    ])
  }
  //===============
  config.merge(conf)
}
