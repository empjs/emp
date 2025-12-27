import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {externalReact, pluginRspackEmpShare} from '@empjs/share'
export default defineConfig(store => {
  const port = store.cliOptions.env ? store.cliOptions.env : 3802
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: `runtimeHost_${port}`,
        manifest: true,
        exposes: {
          './App': './src/App',
        },
        shared: {
          react: {
            singleton: true,
          },
        },
        empRuntime: {
          runtime: {
            lib: `http://${store.server.ip}:2100/sdk.js`,
          },
          framework: {
            libs: [`https://unpkg.com/@empjs/cdn-react@0.19.0/dist/reactRouter.${store.mode}.umd.js`],
            global: 'EMP_ADAPTER_REACT',
          },
          setExternals: externalReact,
        },
      }),
    ],
    build: {
      polyfill: {
        entryCdn: `https://unpkg.com/@empjs/polyfill@0.0.1/dist/es.js`,
      },
    },
    server: {
      port,
      open: false,
    },
    debug: {
      clearLog: false,
      showRsconfig: false,
    },
    define: {port: `${port}`},
  }
})
