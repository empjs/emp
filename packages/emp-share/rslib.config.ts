import {defineConfig, type LibConfig, type RslibConfig} from '@rslib/core'
import {mkdirSync, writeFileSync} from 'node:fs'
import {dirname} from 'node:path'
import {shareGlobalName} from './src/helper/config'

const syntax = 'es2015'
const libraryEntries = {
  index: 'src/index.ts',
  runtime: 'src/runtime/index.ts',
  sdk: 'src/runtime/sdk.ts',
  mfRuntime: 'src/runtime/mfRuntime.ts',
  forceRemote: 'src/plugins/rspack/runtimePlugin/forceRemote.ts',
  adapter: 'src/adapter/index.ts',
  adapterVue: 'src/adapter/index.ts',
  rspack: 'src/plugins/rspack/index.ts',
  react: 'src/framework/react/index.ts',
  vue: 'src/framework/vue/index.ts',
}

const declarationEntryShims = [
  {file: 'dist/runtime.d.ts', target: './runtime/index', defaultExport: true},
  {file: 'dist/runtime.d.cts', target: './runtime/index', defaultExport: true},
  {file: 'dist/mfRuntime.d.ts', target: './runtime/mfRuntime'},
  {file: 'dist/mfRuntime.d.cts', target: './runtime/mfRuntime'},
  {file: 'dist/sdk.d.ts', target: './runtime/sdk'},
  {file: 'dist/sdk.d.cts', target: './runtime/sdk'},
  {file: 'dist/forceRemote.d.ts', target: './plugins/rspack/runtimePlugin/forceRemote', defaultExport: true},
  {file: 'dist/forceRemote.d.cts', target: './plugins/rspack/runtimePlugin/forceRemote', defaultExport: true},
  {file: 'dist/adapter.d.ts', target: './adapter/index'},
  {file: 'dist/adapter.d.cts', target: './adapter/index'},
  {file: 'dist/adapterVue.d.ts', target: './adapter/index'},
  {file: 'dist/adapterVue.d.cts', target: './adapter/index'},
  {file: 'dist/rspack.d.ts', target: './plugins/rspack/index', defaultExport: true},
  {file: 'dist/rspack.d.cts', target: './plugins/rspack/index', defaultExport: true},
  {file: 'dist/react.d.ts', target: './framework/react/index'},
  {file: 'dist/react.d.cts', target: './framework/react/index'},
  {file: 'dist/vue.d.ts', target: './framework/vue/index'},
  {file: 'dist/vue.d.cts', target: './framework/vue/index'},
  {file: 'output/sdk.d.ts', target: './library/sdk'},
]

function writeDeclarationEntryShims() {
  for (const shim of declarationEntryShims) {
    const content = `${shim.defaultExport ? `export {default} from '${shim.target}'\n` : ''}export * from '${shim.target}'\n`
    mkdirSync(dirname(shim.file), {recursive: true})
    writeFileSync(shim.file, content)
  }
}

function getLibraryConfig(format: 'esm' | 'cjs', isDev: boolean): LibConfig {
  return {
    id: `dist-${format}`,
    format,
    bundle: true,
    syntax,
    dts: format === 'cjs' ? {autoExtension: true} : true,
    source: {
      tsconfigPath: './tsconfig.json',
      entry: libraryEntries,
      define: {
        'process.env.EMPSHARE_ENV': JSON.stringify(isDev ? 'dev' : 'prod'),
        'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
      },
    },
    output: {
      target: 'node',
      sourceMap: true,
      minify: !isDev,
      legalComments: 'none',
      externals: ['@empjs/share/forceRemote'],
    },
    tools: {
      rspack: config => {
        config.optimization = {
          ...config.optimization,
          splitChunks: false,
          runtimeChunk: false,
        }
        return config
      },
    },
  }
}

function getBrowserSdkConfig(isDev: boolean): LibConfig {
  return {
    id: 'browser-sdk',
    format: 'umd',
    umdName: shareGlobalName,
    bundle: true,
    autoExternal: false,
    syntax,
    dts: {
      distPath: './output',
    },
    source: {
      tsconfigPath: './tsconfig.json',
      entry: {
        sdk: 'src/library/sdk.ts',
      },
      define: {
        FEDERATION_ALLOW_NEW_FUNCTION: 'true',
        FEDERATION_DEBUG: JSON.stringify(isDev),
        'process.env.EMPSHARE_ENV': JSON.stringify(isDev ? 'dev' : 'prod'),
        'process.env.FEDERATION_DEBUG': JSON.stringify(isDev),
        'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
      },
    },
    output: {
      target: 'web',
      distPath: './output',
      sourceMap: false,
      cleanDistPath: true,
      filename: {
        js: '[name].js',
      },
      legalComments: 'none',
      minify: isDev
        ? false
        : {
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
    tools: {
      rspack: config => {
        config.optimization = {
          ...config.optimization,
          splitChunks: false,
          runtimeChunk: false,
        }
        return config
      },
    },
  }
}

export default defineConfig(({envMode}): RslibConfig => {
  const isDev = envMode === 'development'

  return {
    lib: [getLibraryConfig('esm', isDev), getLibraryConfig('cjs', isDev), getBrowserSdkConfig(isDev)],
    output: {
      target: 'web',
    },
    plugins: [
      {
        name: 'success-callback',
        setup(api) {
          api.onAfterBuild(() => {
            writeDeclarationEntryShims()
            console.log(`${shareGlobalName} build complete`)
          })
        },
      },
    ],
  }
})
