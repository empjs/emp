import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {externalReact, pluginRspackEmpShare} from '@empjs/share'

export default defineConfig(store => {
  const ip = store.server.ip
  const port = 7702
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: 'adapterApp',
        exposes: {},
        remotes: {
          ah: `adapterHost@http://${ip}:7701/emp.json`,
          //mfHost: `mfHost@http://${store.server.ip}:6001/emp.json`,
        },
        dts: {
          consumeTypes: true,
        },
        empRuntime: {
          framework: {
            global: 'EMP_ADAPTER_REACT',
            libs: [`https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js`],
          },
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.10.1/output/sdk.js`,
          },
          // setExternals: externalReact,
        },
      }),
    ],
    define: {ip, port},
    build: {
      polyfill: {
        entryCdn: 'https://unpkg.com/@empjs/polyfill@0.0.2/dist/es.js',
      },
    },
    server: {
      port,
      open: false,
      client: {
        overlay: false,
      },
    },
    debug: {
      // showRsconfig: 'log.json',
      // clearLog: false,
    },
    cache: false,
  }
})
