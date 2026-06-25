import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {externalReact, pluginRspackEmpShare} from '@empjs/share/rspack'
export default defineConfig(store => {
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        empRuntime: {
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.5.3/output/sdk.js`,
            // lib: `http://${store.server.ip}:2100/sdk.js`,
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
        entryCdn: 'https://unpkg.com/@empjs/polyfill@0.0.2/dist/es.js',
      },
    },
    server: {
      port: 1901,
    },
    debug: {
      clearLog: false,
    },
    html: {
      template: 'src/index.html',
    },
  }
})
