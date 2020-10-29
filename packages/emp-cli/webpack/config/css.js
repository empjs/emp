module.exports = (env, config) => {
  const cssConfig = {
    module: {
      rule: {
        css: {
          test: /\.css$/,
          exclude: /node_modules/,
          use: {
            style: {
              loader: require.resolve('style-loader'),
            },
            css: {
              loader: require.resolve('css-loader'),
              options: {
                modules: true,
              },
            },
          },
        },
        sass: {
          test: /\.(scss|sass)$/,
          exclude: /node_modules/,
          use: {
            style: {
              loader: require.resolve('style-loader'),
            },
            css: {
              loader: require.resolve('css-loader'),
              options: {
                modules: true,
              },
            },
            sass: {
              loader: require.resolve('sass-loader'),
              options: {
                implementation: require('sass'),
                sourceMap: env === 'development',
              },
            },
          },
        },
        less: {
          test: /\.less$/,
          exclude: /node_modules/,
          use: {
            style: {
              loader: require.resolve('style-loader'),
            },
            css: {
              loader: require.resolve('css-loader'),
              options: {
                modules: true,
              },
            },
            sass: {
              loader: require.resolve('less-loader'),
              options: {
                lessOptions: {javascriptEnabled: true},
              },
            },
          },
        },
      },
    },
  }
  config.merge(cssConfig)
}
