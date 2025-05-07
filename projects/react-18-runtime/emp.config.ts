import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {externalReact, pluginRspackEmpShare} from '@empjs/share/rspack'
export default defineConfig(store => {
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        empRuntime: {
          framework: {
            global: 'EMP_ADAPTER_REACT',
            libs: [`https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js`],
          },
          runtime: {
            // lib: `https://unpkg.com/@empjs/share@3.2.0/output/sdk.js`,
            lib: `http://${store.server.ip}:2100/sdk.js`,
          },
          setExternals: externalReact,
        },
      }),
    ],
    build: {
      polyfill: {
        entryCdn: 'https://unpkg.com/@empjs/polyfill@0.0.2/dist/es.js',
      },
    },
    define: {ip: store.server.ip},
    server: {
      port: 1801,
      open: false,
      client: {
        overlay: false,
      },
    },
    debug: {
      // showRsconfig: true,
      clearLog: false,
    },
    html: {
      template: 'src/index.html',
    },
  }
})
