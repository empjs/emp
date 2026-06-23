import {defineConfig, type LibConfig} from '@rslib/core'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function getLibConfig(env: 'development' | 'production'): LibConfig {
  const isProd = env === 'production'
  const prodSuffix = isProd ? '.prod' : ''
  const nodeModulesPath = path.resolve(__dirname, 'node_modules')

  return {
    format: 'umd',
    umdName: 'EMP_ADAPTER_VUE',
    bundle: true,
    dts: true,
    syntax: 'es2018',
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
    resolve: {
      alias: {
        vue: path.join(nodeModulesPath, `vue/dist/vue.runtime.esm-browser${prodSuffix}.js`),
        'vue-router': path.join(nodeModulesPath, `vue-router/dist/vue-router.esm-browser${prodSuffix}.js`),
      },
    },
    source: {
      entry: {
        vue: 'src/vue.ts',
        vueRouter: 'src/vueRouter.ts',
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify(env),
      },
    },
    tools: {
      rspack: config => {
        if (config.optimization) {
          config.optimization.removeAvailableModules = false
          config.optimization.removeEmptyChunks = false
          config.optimization.splitChunks = false
        }

        if (isProd && config.output) {
          config.output.pathinfo = false
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
