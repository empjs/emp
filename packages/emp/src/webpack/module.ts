import store from 'src/helper/store'
import wpChain from 'src/helper/wpChain'

export const wpModule = () => {
  //
  const config = {
    module: {
      generator: {
        asset: {
          publicPath: store.config.base,
        },
      },
      rule: {
        scripts: {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /(node_modules|bower_components)/, //不能加 exclude 否则会专程 arrow
          use: {
            ...store.wpo.modules.swcLoader(),
          },
        },
      },
    },
  }
  wpChain.merge(config)
}
