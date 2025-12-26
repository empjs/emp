import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {ModuleFederationPlugin} from '@module-federation/rspack'
export default defineConfig(store => {
  return {
    plugins: [pluginReact()],
    server: {
      port: 4001,
      open: false,
    },
    chain(chain) {
      chain.plugin('module-federation-enhanced').use(
        new ModuleFederationPlugin({
          name: 'runtimeProvider',
          // filename: 'emp.js',
          exposes: {
            './App': './src/App',
          },
          remotes: {
            // remoteApp: 'remoteApp@http://localhost:4001/remoteEntry.js',
          },
          shared: {
            react: {
              singleton: true,
            },
            'react-dom': {
              singleton: true,
            },
          },
        }),
      )
    },
    debug: {
      clearLog: false,
      showRsconfig: 'log.json',
    },
  }
})
