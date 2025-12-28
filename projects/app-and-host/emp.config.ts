import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {externalReact, pluginRspackEmpShare} from '@empjs/share'
export default defineConfig(store => {
  const port = store.cliOptions.env ? store.cliOptions.env : 3710
  const ip = store.server.ip
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: `app_host_${port}`, //(*)不能与主项目重名
        exposes: {
          './Info': './src/components/Info',
          './About': './src/components/About',
        },
        shared: {
          react: {
            singleton: true,
          },
        },
        empRuntime: {
          runtime: {
            // lib: `https://cdn.jsdelivr.net/npm/@empjs/share@3.12.0/output/sdk.js`,
            lib: `http://localhost:2100/sdk.js`,
          },
          framework: {
            libs: [`https://cdn.jsdelivr.net/npm/@empjs/cdn-react-wouter@0.0.4/dist/reactRouter.${store.mode}.umd.js`],
            global: 'BIGO_NOVA_REACT',
          },
          setExternals: externalReact,
        },
        manifest: true,
        // dts: port === '3712',
        dev: port === '3710',
        // dev: true,
        dts: {
          consumeTypes: port === '3710',
          generateTypes: port === '3712',
        },
      }),
    ],
    build: {
      polyfill: {
        entryCdn: `https://cdn.jsdelivr.net/npm/@empjs/polyfill@2026.0.2/dist/61.js`,
      },
    },
    server: {
      port,
      open: false,
    },
    debug: {
      clearLog: false,
      // showRsconfig: `node_modules/log_${port}.json`,
    },
    define: {port: `${port}`, ip: `${ip}`},
    // cache: false,
  }
})
