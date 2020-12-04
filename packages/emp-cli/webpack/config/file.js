module.exports = (env, config) => {
  const fileConfig = {
    module: {
      rule: {
        // 解决svgr ReactComponent 无法获取的问题
        svg: {
          test: /\.svg$/,
          use: {
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
        fonts: {
          test: /\.(|otf|ttf|eot|woff|woff2)$/i,
          type: 'asset/resource',
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
