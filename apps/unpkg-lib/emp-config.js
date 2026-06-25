import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
export default defineConfig(store => {
  const runtimeResolve = import.meta.resolve('./npm-runtime-global-plugin.js').replace('file://', '')
  // console.log('runtimeResolve', runtimeResolve)
  return {
    plugins: [pluginReact()],
    html: {
      title: 'unpkg lib',
    },
    server: {
      port: 3300,
    },
    debug: {
      clearLog: false,
    },
    empShare: {
      name: 'unpkglib',
      exposes: {
        './App': './src/App',
      },
      runtimePlugins: [
        // runtimeResolve
      ],
      shared: {
        react: {singleton: true},
        'react-dom': {singleton: true},
        // react: {
        //   requiredVersion: '^18.2.0',
        // },
        // 'react-dom': {
        //   requiredVersion: '^18.2.0',
        // },
      },
    },
  }
})
