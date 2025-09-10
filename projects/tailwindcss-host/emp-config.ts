import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import pluginTailwindcss from '@empjs/plugin-tailwindcss'
import {externalReact, pluginRspackEmpShare} from '@empjs/share/rspack'

export default defineConfig(store => {
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: 'tailwindcssHost',
        exposes: {
          './App': './src/component/App',
          './Info': './src/component/Info',
          './Color': './src/component/Color',
          './Container': './src/component/Container',
        },
        manifest: true,
        // dts: {
        //   generateTypes: true,
        // },
        empRuntime: {
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.5.3/output/sdk.js`,
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
      title: 'tailwindcss host',
    },
    build: {
      polyfill: {
        mode: 'entry',
        entryCdn: 'https://unpkg.com/@empjs/polyfill@0.0.2/dist/es.js',
        browserslist: store.browserslistOptions.h5,
      },
    },
    server: {
      open: false,
      port: 4401,
    },
    debug: {
      // showRsconfig: 'x.json',
    },
  }
})
