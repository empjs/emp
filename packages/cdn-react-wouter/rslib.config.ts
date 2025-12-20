import {defineConfig, type LibConfig} from '@rslib/core'

function getLibConfig(env: 'development' | 'production'): LibConfig {
  const isProd = env === 'production'
  return {
    format: 'umd',
    umdName: 'BIGO_NOVA_REACT',
    bundle: true,
    syntax: 'es2017',
    output: {
      target: 'web',
      cleanDistPath: true,
      filename: {
        js: `[name].${env}.umd.js`,
      },
      legalComments: 'none',
      minify: isProd
        ? {
            js: true,
            jsOptions: {
              minimizerOptions: {
                format: {
                  comments: false,
                },
              },
            },
          }
        : false,
    },
    source: {
      entry: {
        react: 'src/react.ts',
        reactRouter: 'src/reactRouter.ts',
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify(env),
      },
    },
    tools: {
      rspack: config => {
        config.optimization = {
          moduleIds: 'natural',
          chunkIds: 'natural',
        }
        return config
      },
    },
  }
}

export default defineConfig(() => ({
  lib: [getLibConfig('development'), getLibConfig('production')],
  output: {
    target: 'web',
  },
  source: {
    include: [/[\\/]node_modules[\\/]/],
  },
  plugins: [
    {
      name: 'success-callback',
      setup(api) {
        api.onAfterBuild(() => {
          console.log('onSuccess!')
        })
      },
    },
  ],
}))
