import path from 'path'
import Paths from 'src/helper/paths'
import TerserPlugin from 'terser-webpack-plugin'
import {CleanWebpackPlugin} from 'clean-webpack-plugin'
export default (paths: Paths, mode: string): any => {
  const src = paths.appSrc
  const dist = paths.outDir
  return {
    mode,
    resolve: {
      modules: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        src,
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    entry: {
      index: path.resolve(src, 'index.ts'),
    },
    output: {
      path: dist,
      filename: 'index.js',
      library: {
        name: 'index',
        type: 'umd',
      },
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
                  target: 'es2022',
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
    plugins: [new CleanWebpackPlugin()],
    optimization: {
      // chunkIds: 'named',
      // minimize: true,
      minimizer: [
        /* new TerserPlugin({
          minify: TerserPlugin.swcMinify,
          terserOptions: {
            compress: false,
          },
        }), */
      ],
    },
  }
}
