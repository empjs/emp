import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import pluginTailwindcss from '@empjs/plugin-tailwindcss'
import {externalReact, pluginRspackEmpShare} from '@empjs/share/rspack'

export default defineConfig(store => {
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: 'tailwindcssApp',
        remotes: {
          tailwindcssHost: `tailwindcssHost@http://${store.server.ip}:4401/emp.json`,
        },
        dts: {
          consumeTypes: false,
          generateTypes: false,
        },
        empRuntime: {
          runtime: {
            // lib: `https://unpkg.com/@empjs/share@3.5.3/output/sdk.js`,
            lib: `http://172.29.96.250:2100/sdk.js`,
          },
          framework: {
            libs: [`https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js`],
            global: 'EMP_ADAPTER_REACT',
          },
          setExternals: externalReact,
        },
      }),
      pluginTailwindcss(),
    ],
    html: {
      title: 'tailwindcss',
    },
    build: {
      polyfill: {
        mode: 'entry',
        entryCdn: 'https://unpkg.com/@empjs/polyfill@0.0.2/dist/es.js',
        browserslist: store.browserslistOptions.h5,
      },
    },
    cache: true,
    server: {
      open: false,
      port: 4402,
    },
  }
})
