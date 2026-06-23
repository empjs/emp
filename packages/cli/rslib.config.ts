import {defineConfig, type RslibConfig} from '@rslib/core'

const node22Syntax = ['node >= 22.12.0']

export default defineConfig(({envMode}): RslibConfig => {
  const isDev = envMode === 'development'
  // console.log('isDev', isDev, envMode)
  return {
    lib: [
      {
        id: 'esm',
        bundle: true,
        format: 'esm',
        syntax: node22Syntax,
        shims: {
          esm: {
            __filename: true,
            __dirname: true,
            require: true,
          },
        },
        dts: {
          autoExtension: true,
        },
      },
      {
        id: 'cjs',
        bundle: true,
        format: 'cjs',
        syntax: node22Syntax,
        shims: {
          cjs: {
            'import.meta.url': true,
          },
        },
        dts: {
          autoExtension: true,
        },
      },
    ],
    source: {
      tsconfigPath: './tsconfig.json',
      define: {
        'process.env.ENV': JSON.stringify(isDev ? 'dev' : 'prod'),
      },
      entry: {
        index: 'src/index.ts',
      },
    },
    output: {
      target: 'node',
      sourceMap: isDev,
      minify: !isDev,
      externals: {
        '@rsdoctor/rspack-plugin': 'commonjs @rsdoctor/rspack-plugin',
      },
    },
  }
})
