import path from 'path'
import gls from 'src/helper/globalVars'
import wpChain from 'src/helper/wpChain'
import {Configuration} from 'webpack'
export const wpCommon = () => {
  const config: Configuration = {
    mode: gls.wpEnv,
    watchOptions: {
      ignored: ['**/.git/**', '**/node_modules/**', '**/dist/**'],
    },

    cache: {
      type: 'filesystem',
      profile: true,
    },

    resolve: {
      modules: [gls.resolve('node_modules'), gls.resolve('src'), 'node_modules'],
      alias: {
        src: gls.appSrc,
      },
      extensions: [
        '.js',
        '.jsx',
        '.mjs',
        '.ts',
        '.tsx',
        '.css',
        '.less',
        '.scss',
        '.sass',
        '.json',
        '.wasm',
        '.vue',
        '.svg',
        '.svga',
      ],
    },
    entry: {
      index: path.resolve(gls.appSrc, 'index.ts'),
    },
    experiments: {
      outputModule: true,
      topLevelAwait: true,
      buildHttp: {allowedUris: []},
    },
    output: {
      publicPath: 'auto',
      clean: true, //替代 clean-webpack-plugin
      path: gls.outDir,
      filename: 'index.js',
      /* library: {
        name: 'index',
        type: 'module',
        // type: 'umd',
      }, */
      environment: {
        arrowFunction: false,
        bigIntLiteral: false,
        const: false,
        destructuring: false,
        forOf: false,
        dynamicImport: false,
        module: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          // exclude: /(node_modules|bower_components)/,//不能加 exclude 否则会专程 arrow
          use: [
            {
              loader: require.resolve('swc-loader'),
              options: {
                jsc: {
                  minify: {
                    compress: false,
                  },
                  target: 'es2015',
                  externalHelpers: false,
                  parser: {
                    syntax: 'typescript',
                  },
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [],
    optimization: {
      chunkIds: 'named',
      minimize: false,
    },
    stats: {
      // all: true,
    },
  }
  wpChain.merge(config)
}
