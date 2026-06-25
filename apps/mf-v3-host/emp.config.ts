import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {pluginRspackEmpShare} from '@empjs/share'

export default defineConfig(store => {
  const ip = store.getLanIp()
  const port = 6001
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: 'mfv3Host',
        shared: {
          react: {singleton: true},
          'react-dom': {singleton: true},
        },
        exposes: {
          './App': './src/App',
        },
        dev: false,
      }),
    ],
    define: {ip, port},
    server: {
      port,
      open: false,
    },
    debug: {
      clearLog: false,
      // showRsconfig: 'log.json',
    },
  }
})
