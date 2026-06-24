import {defineConfig} from '@rslib/core'

const defaultNodeSyntax = ['node >= 22.12.0']
const esmShims = {
  __filename: true,
  __dirname: true,
  require: true,
}

export function defineNodeEsmConfig(options = {}) {
  const {entry = {index: 'src/index.ts'}, syntax = defaultNodeSyntax, define, externals} = options

  return defineConfig(({envMode}) => {
    const isDev = envMode === 'development'
    const source = {
      tsconfigPath: './tsconfig.json',
      entry,
    }

    if (define) {
      source.define = typeof define === 'function' ? define({envMode, isDev}) : define
    }

    const output = {
      target: 'node',
      sourceMap: isDev,
      minify: !isDev,
    }

    if (externals) {
      output.externals = externals
    }

    return {
      lib: [
        {
          id: 'node-esm',
          bundle: true,
          format: 'esm',
          syntax,
          shims: {
            esm: esmShims,
          },
          dts: true,
        },
      ],
      source,
      output,
    }
  })
}
