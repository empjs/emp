import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
export default defineConfig(store => {
  return {
    plugins: [pluginReact()],
    server: {
      port: 6001,
      open: false,
    },
    debug: {
      showRsconfig: false,
    },
    empShare: {
      dts: true,
      name: 'react_eger_host',
      exposes: {
        './App': './src/App',
      },
      shared: {
        react: {
          singleton: true,
          eager: true,
          requiredVersion: '^17.0.2',
        },
        'react-dom': {
          singleton: true,
          eager: true,
          requiredVersion: '^17.0.2',
        },
      },
    },
  }
})
