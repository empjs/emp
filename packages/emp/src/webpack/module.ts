import store from 'src/helper/store'
import wpChain from 'src/helper/wpChain'
import path from 'path'
export const wpModule = () => {
  //
  const config = {
    module: {
      generator: {
        'asset/resource': {
          publicPath: store.config.base,
        },
      },
      rule: {
        scripts: {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /(node_modules|bower_components)/, //不能加 exclude 否则会专程 arrow
          use: {
            swc: {
              loader: store.empResolve(path.resolve(store.empSource, 'webpack/loader/swc')),
              options: {},
            },
          },
        },
      },
    },
  }
  wpChain.merge(config)
}
