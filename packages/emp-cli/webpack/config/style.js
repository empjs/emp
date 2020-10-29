// const Configs = require('webpack-chain')
// const config = new Configs()
// const {resolveApp} = require('../../helpers/paths')
// const fs = require('fs')
const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/
const lessRegex = /\.less$/
const lessModuleRegex = /\.module\.less$/
//
// const remotePostcssConfigPath = resolveApp('postcss.config.js')
// const remotePostcssConfig = fs.existsSync(remotePostcssConfigPath) ? require(remotePostcssConfigPath) : {plugins: []}
// console.log('remotePostcssConfig', remotePostcssConfig)
//
module.exports = (env, config) => {
  // config.module.rule('css').test(cssRegex).use().exclude(cssModuleRegex)
  const getStyleLoader = (modules = false, preProcessor = {}) => {
    return {
      style: {
        loader: require.resolve('style-loader'),
      },
      css: {
        loader: require.resolve('css-loader'),
        options: {
          modules,
        },
      },
      postcss: {
        loader: require.resolve('postcss-loader'),
        // options: {
        //   // config: remotePostcssConfig,
        //   postcssOptions: {
        //     plugins: [['autoprefixer', {}], ['postcss-preset-env', {}], ...remotePostcssConfig.plugins],
        //   },
        // },
      },
      ...preProcessor,
      // postcss: {
      //   loader: require.resolve('postcss-loader'),
      //   options: {
      //     // ident: 'postcss',
      //     /* plugins: () => [
      //       require('postcss-flexbugs-fixes'),
      //       require('postcss-preset-env')({
      //         autoprefixer: {
      //           flexbox: 'no-2009',
      //         },
      //         stage: 3,
      //       }),
      //     ], */
      //     /* postcssOptions: {
      //       plugins: ['postcss-present-env'],
      //     }, */
      //   },
      // },
    }
  }
  const styleConfig = {
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
  config.merge(styleConfig)
}
