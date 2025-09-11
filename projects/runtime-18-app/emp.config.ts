import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {externalReact, pluginRspackEmpShare} from '@empjs/share'
export default defineConfig(store => {
  const ip = store.getLanIp()
  const port = 3801
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: `runtime_app`,
        manifest: true,
        // experiments: {
        //   asyncStartup: true,
        // },
        exposes: {
          // './Title': './src/Title',
        },
        empRuntime: {
          framework: {
            global: 'EMP_ADAPTER_REACT',
            libs: [`https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js`],
          },
          runtime: {
            lib: `http://${store.server.ip}:2100/sdk.js`,
          },
          setExternals: externalReact,
        },
        // dts: {
        //   generateTypes: false,
        //   consumeTypes: true,
        // },
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
    html: {
      template: 'src/index.html',
    },
    define: {runtimeHost: `http://${ip}:3802/emp.js`, ip: `${ip}`},
    // debug: {showRsconfig: true},
  }
})
