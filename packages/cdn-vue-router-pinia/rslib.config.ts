import {defineConfig, type LibConfig} from '@rslib/core'
import path from 'path'

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
    },
    resolve: {
      alias: {
        vue: path.join(nodeModulesPath, `vue/dist/vue.runtime.esm-browser${prodSuffix}.js`),
        'vue-router': path.join(nodeModulesPath, `vue-router/dist/vue-router.esm-browser${prodSuffix}.js`),
        pinia: path.join(nodeModulesPath, 'pinia/dist/pinia.esm-browser.js'),
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
        // 基础优化设置
        if (config.optimization) {
          config.optimization.removeAvailableModules = false
          config.optimization.removeEmptyChunks = false
          config.optimization.splitChunks = false
        }

        // 生产环境专用优化
        if (isProd) {
          if (config.output) {
            config.output.pathinfo = false
          }

          // 简化的路径替换插件
          if (!config.plugins) config.plugins = []
          config.plugins.push({
            apply: (compiler: any) => {
              compiler.hooks.emit.tapAsync('CleanPaths', (compilation: any, callback: any) => {
                Object.keys(compilation.assets).forEach(filename => {
                  if (filename.endsWith('.js')) {
                    const asset = compilation.assets[filename]
                    let source = asset.source()
                    source = source.replace(/\.\.\/\.\.\/node_modules\/[^"'\s)]+/g, 'external-module')
                    compilation.assets[filename] = {
                      source: () => source,
                      size: () => source.length,
                    }
                  }
                })
                callback()
              })
            },
          })
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
    legalComments: 'none',
    minify: {
      js: true,
      jsOptions: {
        minimizerOptions: {
          format: {
            comments: false,
          },
        },
      },
    },
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
