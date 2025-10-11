import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import pluginTailwindcss from '@empjs/plugin-tailwindcss'
import {externalReact, pluginRspackEmpShare} from '@empjs/share/rspack'
import {tanstackRouter} from '@tanstack/router-plugin/rspack'
export default defineConfig(store => {
  return {
    chain(config) {
      config.plugin('tanstack-router').use(
        tanstackRouter({
          target: 'react',
          autoCodeSplitting: true,
        }),
      )
    },
    plugins: [
      pluginTailwindcss(),
      pluginReact(),
      pluginRspackEmpShare({
        empRuntime: {
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.10.1/output/sdk.js`,
            // lib: `http://${store.server.ip}:2100/sdk.js`,
          },
          framework: {
            libs: [
              // `https://unpkg.com/@empjs/cdn-react-tanstack@0.19.2/dist/reactRouter.${store.mode}.umd.js`,
              `http://${store.server.ip}:2200/reactRouter.${store.mode}.umd.js`,
            ],
            global: 'EMP_REACT_19_TANSTACK',
          },
          setExternals: o => {
            o['react'] = 'EMP_REACT_19_TANSTACK.React'
            o['react-dom'] = 'EMP_REACT_19_TANSTACK.ReactDOM'
            o['react/jsx-dev-runtime'] = 'EMP_REACT_19_TANSTACK'
            o['react/jsx-runtime'] = 'EMP_REACT_19_TANSTACK'
            o['react-dom/client'] = 'EMP_REACT_19_TANSTACK'
            o['@tanstack/react-router'] = 'EMP_REACT_19_TANSTACK.ReactRouterDOM'
          },
        },
      }),
    ],
    build: {
      polyfill: {
        entryCdn: 'https://unpkg.com/@empjs/polyfill@2025.9.12/dist/c71.js',
      },
    },
    server: {
      port: 1992,
    },
    debug: {
      clearLog: false,
    },
  }
})
