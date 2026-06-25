import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
export default defineConfig(store => {
  const runtimeResolve = import.meta.resolve('./npm-runtime-global-plugin.js').replace('file://', '')
  console.log('runtimeResolve', runtimeResolve)
  return {
    plugins: [pluginReact()],
    html: {
      title: 'unpkg demo',
    },
    server: {
      port: 8001,
    },
    debug: {
      clearLog: false,
    },
    empShare: {
      name: 'unpkgdemo',
      exposes: {
        // './App': './src/App',
      },
      runtimePlugins: [runtimeResolve],
      remotes: {
        unpkglib: `unpkglib@http://localhost:3300/emp.js`,
      },
      shared: {
        react: {
          requiredVersion: '^18.2.0',
        },
        'react-dom': {
          requiredVersion: '^18.2.0',
        },
      },
    },
  }
})
