import store from 'src/helper/store'
import wpChain from 'src/helper/wpChain'
import path from 'path'
import loader from 'src/webpack/loader'
class WPFile {
  constructor() {}
  async setup() {
    const config = {
      module: {
        rule: {
          // 解决svgr ReactComponent 无法获取的问题
          svg: {
            test: /\.svg$/,
            use: {
							svgo: {
								loader: require.resolve('svgo-loader'),
							},
              url: {
                loader: require.resolve('url-loader'), //解决 ReactComponent 无法获取问题
                options: {
                  esModule: false,
                },
              },
            },
          },
          image: {
            test: /\.(png|jpe?g|gif|webp|ico)$/i,
            type: 'asset/resource',
          },
          fonts: {
            test: /\.(|otf|ttf|eot|woff|woff2)$/i,
            type: 'asset/resource',
          },
          inline: {
            resourceQuery: /inline/,
            type: 'asset/inline',
          },
          //解决 svga 解析失败问题
          svga: {
            test: /\.(svga)$/i,
            type: 'asset/resource',
          },
        },
      },
    }
    wpChain.merge(config)
  }
}
export default WPFile
