import {defineConfig, type RslibConfig} from '@rslib/core'

export default defineConfig(({envMode}): RslibConfig => {
  const isDev = envMode === 'development'
  // console.log('isDev', isDev, envMode)
  return {
    lib: [
      {
        bundle: true,
        format: 'esm',
        shims: {
          esm: {
            __filename: true,
            __dirname: true,
            require: true,
          },
        },
        dts: true,
      },
      {
        bundle: true,
        format: 'cjs',
        shims: {
          cjs: {
            'import.meta.url': true,
          },
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
