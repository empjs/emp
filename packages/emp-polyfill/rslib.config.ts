import {defineConfig} from '@rslib/core'

export default defineConfig({
  lib: [
    {
      format: 'iife',
      bundle: true,
      autoExternal: false,
      syntax: 'es2017',
      output: {
        target: 'web',
        cleanDistPath: true,
        filename: {
          js: '[name].js',
        },
        legalComments: 'none',
        minify: true,
      },
      source: {
        entry: {
          '61': 'src/chrome-61/index.ts',
          // c71: 'src/c71.ts',
        },
        define: {
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      },
      tools: {
        rspack: {
          optimization: {
            moduleIds: 'natural',
            chunkIds: 'natural',
            mangleExports: 'size',
            splitChunks: false,
          },
        },
      },
    },
  ],
  plugins: [
    {
      name: 'success-callback',
      setup(api) {
        api.onAfterBuild(() => {
          console.log('✅ 构建成功！产物已优化压缩')
        })
      },
    },
  ],
})
