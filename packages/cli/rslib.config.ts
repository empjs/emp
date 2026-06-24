import {defineConfig, type RslibConfig} from '@rslib/core'

const nodeSyntax = ['node >= 20.19.0']
const esmShims = {
  __filename: true,
  __dirname: true,
  require: true,
}

export default defineConfig(({envMode}): RslibConfig => {
  const isDev = envMode === 'development'

  return {
    lib: [
      {
        id: 'node-esm',
        bundle: true,
        format: 'esm',
        syntax: nodeSyntax,
        shims: {
          esm: esmShims,
        },
        dts: true,
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
