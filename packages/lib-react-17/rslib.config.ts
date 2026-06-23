import {defineConfig, type LibConfig, type RslibConfig} from '@rslib/core'

const syntax = 'es2015'

function getRuntimeModuleConfig(format: 'esm' | 'cjs'): LibConfig {
  return {
    id: `runtime-${format}`,
    format,
    bundle: true,
    syntax,
    dts: format === 'cjs' ? {autoExtension: true} : true,
    source: {
      tsconfigPath: './tsconfig.json',
      entry: {
        runtime: 'src/runtime.ts',
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
    },
    output: {
      target: 'web',
      sourceMap: true,
      minify: false,
      legalComments: 'none',
    },
    tools: {
      rspack: config => {
        config.optimization = {
          ...config.optimization,
          nodeEnv: 'production',
          splitChunks: false,
          runtimeChunk: false,
        }
        return config
      },
    },
  }
}

function getRuntimeUmdConfig(env: 'development' | 'production'): LibConfig {
  const isProd = env === 'production'

  return {
    id: `runtime-umd-${env}`,
    format: 'umd',
    umdName: 'EMP_ADAPTER_REACT',
    bundle: true,
    autoExternal: false,
    syntax,
    source: {
      tsconfigPath: './tsconfig.json',
      entry: {
        runtime: 'src/runtime.ts',
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify(env),
      },
    },
    output: {
      target: 'web',
      sourceMap: true,
      filename: {
        js: isProd ? '[name].umd.js' : '[name].development.umd.js',
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
    tools: {
      rspack: config => {
        config.optimization = {
          ...config.optimization,
          nodeEnv: env,
          splitChunks: false,
        }
        return config
      },
    },
  }
}

export default defineConfig((): RslibConfig => ({
  lib: [
    getRuntimeModuleConfig('esm'),
    getRuntimeModuleConfig('cjs'),
    getRuntimeUmdConfig('development'),
    getRuntimeUmdConfig('production'),
  ],
  output: {
    target: 'web',
  },
  plugins: [
    {
      name: 'success-callback',
      setup(api) {
        api.onAfterBuild(() => {
          console.log('EMP_ADAPTER_REACT build complete')
        })
      },
    },
  ],
}))
