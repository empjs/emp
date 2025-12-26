import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {ModuleFederationPlugin} from '@module-federation/rspack'
export default defineConfig(store => {
  return {
    plugins: [pluginReact()],
    server: {
      port: 4000,
      open: false,
    },
    chain(chain) {
      chain.plugin('module-federation-enhanced').use(
        new ModuleFederationPlugin({
          name: 'runtimeHost',
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
      showRsconfig: false,
    },
  }
})
