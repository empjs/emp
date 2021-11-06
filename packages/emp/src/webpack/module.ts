import globalVars from 'src/helper/globalVars'
import wpChain from 'src/helper/wpChain'
export const wpModule = () => {
  const config = {
    module: {
      rule: {
        scripts: {
          test: /\.(js|jsx|ts|tsx)$/,
          // exclude: /(node_modules|bower_components)/,//不能加 exclude 否则会专程 arrow
          use: {
            swc: {
              loader: require.resolve('@efox/swc-loader'),

              options: {
                sourceMaps: true,
                jsc: {
                  /* minify: {
                    compress: false,
                  }, */
                  target: globalVars.config.build.target,
                  externalHelpers: false,
                  parser: {
                    syntax: 'typescript',
                  },
                },
              },
            },
          },
        },
      },
    },
  }
  wpChain.merge(config)
}
