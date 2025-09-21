import {defineConfig} from '@empjs/core'

export default defineConfig({
  framework: 'vue2',
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'static'
  },
  server: {
    port: 3002,
    open: true
  }
})