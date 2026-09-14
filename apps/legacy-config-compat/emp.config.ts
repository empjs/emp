import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'

export default defineConfig({
  appSrc: 'src',
  appEntry: 'index.tsx',
  html: {
    title: 'EMP legacy configuration compatibility',
    template: 'src/index.html',
    favicon: '',
  },
  server: {
    port: 8105,
    open: false,
    ...(process.env.EMP_LEGACY_HTTP2 === 'true' ? {http2: true} : {}),
  },
  build: {
    useESM: false,
    devtool: 'source-map',
    polyfill: {
      mode: 'entry',
      splitChunks: true,
      browserslist: ['Chrome >= 60'],
    },
  },
  css: {
    prifixName: 'legacy',
  },
  debug: {
    clearLog: false,
    showPerformance: false,
    newTreeshaking: false,
  },
  plugins: [
    pluginReact({
      splickChunks: true,
    }),
  ],
})
