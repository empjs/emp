import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import pluginTailwindcss from '@empjs/plugin-tailwindcss'
import {externalReact, pluginRspackEmpShare} from '@empjs/share/rspack'
import {tanstackRouter} from '@tanstack/router-plugin/rspack'

// const cdnHost = 'https://cdn.jsdelivr.net/npm'
const cdnHost = 'https://unpkg.com'
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
            lib: `${cdnHost}/@empjs/share@3.10.1/output/sdk.js`,
            // lib: `http://${store.server.ip}:2100/sdk.js`,
          },
          framework: {
            libs: [
              `${cdnHost}/@empjs/cdn-react-tanstack@0.19.2/dist/reactRouter.${store.mode}.umd.js`,
              // `http://${store.server.ip}:2200/reactRouter.${store.mode}.umd.js`,
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
        entryCdn: `${cdnHost}/@empjs/polyfill@2025.9.12/dist/c71.js`,
        // browserslist: ['chrome >= 88', 'edge >= 88', 'firefox >= 78', 'safari >= 14'],
      },
    },
    server: {
      port: 1992,
    },
    debug: {
      clearLog: false,
      // showRsconfig: 'log.json',
    },
  }
})
