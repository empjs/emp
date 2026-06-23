import {defineConfig, type RslibConfig} from '@rslib/core'

const node22Syntax = ['node >= 22.12.0']
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
        syntax: node22Syntax,
        shims: {
          esm: esmShims,
        },
        dts: true,
      },
    ],
    source: {
      tsconfigPath: './tsconfig.json',
      entry: {
        index: 'src/index.ts',
      },
    },
    output: {
      target: 'node',
      sourceMap: isDev,
      minify: !isDev,
    },
  }
})
