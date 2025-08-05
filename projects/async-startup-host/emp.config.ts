import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {externalReact, pluginRspackEmpShare} from '@empjs/share'

export default defineConfig(store => {
  const ip = store.getLanIp()
  const port = 9901
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: 'asyncStartupHost',
        // dts: true,

        experiments: {
          asyncStartup: true,
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: '18',
            eager: false, // 异步加载
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '18',
            eager: false, // 异步加载
          },
        },
        exposes: {
          './App': './src/App',
        },
        manifest: true,
        // dts: {
        //   generateTypes: true,
        // },
        // dev: {
        //   disableHotTypesReload: false,
        //   disableDynamicRemoteTypeHints: false,
        //   disableLiveReload: false,
        // },
        // dev: false,
        // empRuntime: {
        //   framework: {
        //     global: 'EMP_ADAPTER_REACT',
        //     libs: [`https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js`],
        //   },
        //   runtime: {
        //     // lib: `https://unpkg.com/@empjs/share@3.6.0-beta.1/output/sdk.js`,
        //     lib: `http://${ip}:2100/sdk.js`,
        //   },
        //   setExternals: externalReact,
        // },
        // experiments: {
        //   federationRuntime: 'hoisted',
        // },
        // dataPrefetch: true,
      }),
    ],
    build: {
      polyfill: {
        mode: 'entry',
        entryCdn: 'https://unpkg.com/@empjs/polyfill@0.0.2/dist/es.js',
        browserslist: store.browserslistOptions.h5,
      },
    },
    server: {
      port,
      open: false,
    },
    debug: {
      // showRsconfig: true,
      // clearLog: false,
    },
  }
})
