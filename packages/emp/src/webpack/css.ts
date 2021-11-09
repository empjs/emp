const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/
const lessRegex = /\.less$/
const lessModuleRegex = /\.module\.less$/

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
import wpChain from 'src/helper/wpChain'
export const wpCSS = (env: string | undefined) => {
  const isDev = env === 'development'
  const localIdentName = isDev ? '[path][name]-[local]-[hash:base64:5]' : '[local]-[hash:base64:5]'
  const getStyleLoader = (modules = false, preProcessor = {}) => {
    return {
      style: {
        loader: isDev ? require.resolve('style-loader') : MiniCssExtractPlugin.loader,
        options: {},
      },
      css: {
        loader: require.resolve('css-loader'),
        options: {
          modules: modules ? {localIdentName} : modules,
        },
      },
      postcss: {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            hideNothingWarning: true,
          },
        },
      },
      ...preProcessor,
    }
  }
  const config = {
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
          use: {
            ...getStyleLoader(true),
          },
        },
        sassModule: {
          test: sassModuleRegex,
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
          use: {
            ...getStyleLoader(true, {
              less: {
                loader: require.resolve('less-loader'),
              },
            }),
          },
        },
      },
    },
  }
  wpChain.merge(config)
}
