import globalVars from 'src/helper/globalVars'
import wpChain from 'src/helper/wpChain'
import {SWCLoaderOptions} from '@efox/swc-loader/types/swcType'
export const wpModule = () => {
  const isDev = globalVars.wpEnv === 'development'
  console.log('isDev', isDev)
  const swcOptions: SWCLoaderOptions = {
    sourceMaps: true,
    jsc: {
      // minify: {
      //   compress: false,
      // },
      target: globalVars.config.build.target,
      externalHelpers: false,
      parser: {
        syntax: 'typescript',
        tsx: true,
      },
      transform: {
        react: {
          runtime: 'automatic',
          importSource: 'react',
          // refresh: isDev,
          development: isDev,
          useBuiltins: false,
        },
      },
    },
  }
  //
  const config = {
    module: {
      rule: {
        scripts: {
          test: /\.(js|jsx|ts|tsx)$/,
          // exclude: /(node_modules|bower_components)/,//不能加 exclude 否则会专程 arrow
          use: {
            swc: {
              loader: require.resolve('@efox/swc-loader'),

              options: swcOptions,
            },
          },
        },
      },
    },
  }
  wpChain.merge(config)
}
