import {defineConfig, type LibConfig} from '@rslib/core'
import path from 'path'

function getLibConfig(env: 'development' | 'production'): LibConfig {
  const isProd = env === 'production'
  const nodeModulesPath = path.resolve(__dirname, 'node_modules')
  const ext = isProd ? `.min` : ''
  return {
    format: 'umd',
    umdName: 'EMP_ADAPTER_VUE_v2',
    bundle: true,
    dts: true,
    syntax: 'es5',
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
        vue: path.join(nodeModulesPath, `vue/dist/vue${ext}.js`),
        'vue-router': path.join(nodeModulesPath, `vue-router/dist/vue-router${ext}.js`),
        vuex: path.join(nodeModulesPath, `vuex/dist/vuex${ext}.js`),
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
                    // 替换 pnpm 生成的长路径，只替换模块引用路径部分
                    source = source.replace(
                      /(["'])\.\.\/\.\.\/node_modules\/\.pnpm\/([^"'\s)]+)\/node_modules\//g,
                      '$1',
                    )
                    // 替换普通的 node_modules 路径，只替换模块引用路径部分
                    source = source.replace(/(["'])\.\.\/\.\.\/node_modules\//g, '$1')
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
