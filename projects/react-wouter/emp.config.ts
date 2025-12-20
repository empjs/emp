import {defineConfig, empHelper, rspack} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {externalReact, pluginRspackEmpShare} from '@empjs/share'

//
// const globalVal = 'EMP_REACT_19_TANSTACK'
const globalVal = 'BIGO_NOVA_REACT'
const cdnHost = 'https://cdn.jsdelivr.net/npm'
// const cdnHost = 'https://unpkg.com'
//
export default defineConfig(store => {
  return {
    base: '/',
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        empRuntime: {
          runtime: {
            lib: `${cdnHost}/@empjs/share@3.10.1/output/sdk.js`,
            // lib: `http://${store.server.ip}:2100/sdk.js`,
          },
          framework: {
            global: globalVal,
            libs: [
              // `https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js`
              `http://localhost:2200/reactRouter.${store.mode}.umd.js`,
              // `http://localhost:62206/reactRouter.${store.mode}.umd.js`,
              // `${cdnHost}/@empjs/cdn-react-tanstack@0.19.2/dist/react.${store.mode}.umd.js`,
            ],
          },
          setExternals(o: any) {
            o['react'] = `${globalVal}.React`
            o['react-dom'] = `${globalVal}.ReactDOM`
            o['react/jsx-dev-runtime'] = `${globalVal}`
            o['react/jsx-runtime'] = `${globalVal}`
            o['react-dom/client'] = `${globalVal}`
            o['wouter'] = `${globalVal}.Wouter`
          },
        },
      }),
    ],
  }
})
