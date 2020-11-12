module.exports = (env, config) => {
  const fileConfig = {
    module: {
      rule: {
        // 解决svgr ReactComponent 无法获取的问题
        svg: {
          test: /\.svg$/,
          use: {
            /* babel: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
              },
            },
            svg: {
              loader: '@svgr/webpack',
              options: {
                babel: 'false',
              },
            }, */
            url: {
              loader: 'url-loader', //解决 ReactComponent 无法获取问题
              options: {
                esModule: false,
              },
            },
          },
        },
        image: {
          test: /\.(png|jpe?g|gif|webp|ico)$/i,
          type: 'asset',
        },
        //解决 svga 解析失败问题
        svga: {
          test: /\.(svga)$/i,
          type: 'asset/resource',
        },
      },
    },
  }
  config.merge(fileConfig)
}
