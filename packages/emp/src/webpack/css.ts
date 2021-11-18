import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import store from 'src/helper/store'
import wpChain from 'src/helper/wpChain'
//
const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/
const lessRegex = /\.less$/
const lessModuleRegex = /\.module\.less$/
//
export const wpCSS = () => {
  const isDev = store.wpo.mode === 'development'
  const {splitCss} = store.config
  //
  const checkStyleLoader = () => {
    if (!splitCss) return true
    if (isDev) return true
    return false
  }
  const checkMiniCss = () => {
    if (splitCss && !isDev) return true
    return false
  }
  //
  const localIdentName = isDev ? '[path][name]-[local]-[hash:base64:5]' : '[local]-[hash:base64:5]'
  const styleLoader = (isStyle: boolean) => {
    return isStyle
      ? {
          loader: require.resolve('style-loader'),
          options: {},
        }
      : {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: store.config.base, //修复css 绝对路径的问题
          },
        }
  }
  const getStyleLoader = (modules = false, preProcessor = {}) => {
    return {
      style: styleLoader(checkStyleLoader()),
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
  const config: any = {
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
                  sourceMap: isDev,
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
                  sourceMap: isDev,
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
  //[css minify]
  // console.log(`checkMiniCss()`, checkMiniCss())
  if (checkMiniCss()) {
    if (store.config.build.minify === true) {
      wpChain.optimization.minimizer('CssMinimizerPlugin').use(CssMinimizerPlugin, [
        {
          parallel: true,
          // sourceMap: false,
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
    }
    wpChain.plugin('MiniCssExtractPlugin').use(MiniCssExtractPlugin, [
      {
        ignoreOrder: true,
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].chunk.css',
        /**
            experimentalUseImportModule
            https://github.com/webpack-contrib/mini-css-extract-plugin#experimentalUseImportModule
            Use an experimental webpack API to execute modules instead of child compilers.
            This improves performance and memory usage a lot, but isn't as stable as the normal approach.
            When combined with experiments.layers, this adds a layer option to the loader options to specify the layer of the css execution.
            You need to have at least webpack 5.33.2.
           */
        // experimentalUseImportModule: true,
      },
    ])
  }
  wpChain.merge(config)
}
