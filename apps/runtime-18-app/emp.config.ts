import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {externalReact, pluginRspackEmpShare} from '@empjs/share'
export default defineConfig(store => {
  const port = 3801
  const host = `localhost`
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: `runtime_app`,
        shared: {
          react: {
            singleton: true,
          },
        },
        empRuntime: {
          framework: {
            global: 'EMP_ADAPTER_REACT',
            libs: [`https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js`],
          },
          runtime: {
            lib: `http://${host}:2100/sdk.js`,
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
    html: {
      template: 'src/index.html',
    },
    define: {runtimeHost: `http://${host}:3802/emp.js`, ip: `${store.server.ip}`},
    debug: {
      // showRsconfig: 'log.json',
    },
  }
})
