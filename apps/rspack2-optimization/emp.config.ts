import {defineConfig} from '@empjs/cli'

export default defineConfig(() => {
  return {
    appSrc: 'src',
    appEntry: 'index.ts',
    build: {
      target: 'es2018',
      moduleIds: 'hashed',
      rspack: {
        experiments: {
          pureFunctions: true,
        },
        splitChunks: {
          chunks: 'all',
          enforceSizeThreshold: 80000,
        },
        parser: {
          javascript: {
            pureFunctions: ['createPureValue'],
          },
          css: {
            resolveImport: false,
          },
        },
        swc: {
          detectSyntax: 'auto',
        },
      },
    },
    debug: {
      clearLog: false,
    },
  }
})
