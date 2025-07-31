import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import pluginRspackEmpShare, {externalReact} from '@empjs/share/rspack'
import getConfig from '../mf-host/emp.runtime'
export default defineConfig(store => {
  // const ip = store.getLanIp()
  // const {empRuntime, polyfillCdn} = getConfig(ip, store)
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: store.uniqueName,
        shared: {
          react: {
            singleton: true,
            requiredVersion: '18',
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '18',
          },
        },
        remotes: {
          mfHost: `mfHost@http://${store.server.ip}:6001/emp.js`,
        },
        empRuntime: {
          framework: {
            global: 'EMP_ADAPTER_REACT',
            // libs: [`https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js`],
            libs: [`https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.development.umd.js`],
            // libs: [`http://${store.server.ip}:1800/reactRouter.${store.mode}.umd.js`],
          },
          runtime: {
            // lib: `https://unpkg.com/@empjs/share@3.6.0-beta.1/output/sdk.js`,
            lib: `http://${store.server.ip}:2100/sdk.js`,
          },
          setExternals: (o, global) => {
            o = externalReact(o, global)
            console.log(o)
            return o
          },
        },
        // experiments: {
        //   federationRuntime: 'hoisted',
        // },
        // manifest: true,
        // dataPrefetch: true,
      }),
    ],
    build: {
      polyfill: {
        entryCdn: `https://unpkg.com/@empjs/polyfill@0.0.1/dist/es.js`,
      },
      browserslist: store.browserslistOptions.h5,
      sourcemap: true,
    },
    html: {
      template: 'src/index.html',
    },
    server: {
      port: 6002,
      open: false,
    },
    debug: {
      // showRsconfig: true,
      clearLog: false,
    },
  }
})
