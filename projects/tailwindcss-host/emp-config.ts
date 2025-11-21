import {defineConfig} from '@empjs/cli'
import pluginLightningcss, {postcss} from '@empjs/plugin-lightningcss'
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
          './TailwindWrap': './src/component/TailwindWrap',
        },
        manifest: true,
        // dts: {
        //   generateTypes: true,
        // },
        empRuntime: {
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.11.3/output/sdk.js`,
          },
          framework: {
            libs: [`https://unpkg.com/@empjs/cdn-react@0.19.1/dist/reactRouter.${store.mode}.umd.js`],
            global: 'EMP_ADAPTER_REACT',
          },
          setExternals: externalReact,
        },
      }),

      pluginTailwindcss(),
      pluginLightningcss({transform: {visitor: postcss}, enablePostcss: true}),
    ],
    html: {
      title: 'tailwindcss host',
    },
    build: {
      polyfill: {
        mode: 'entry',
        entryCdn: 'https://unpkg.com/@empjs/polyfill@2025.9.12/dist/c71.js',
        browserslist: store.browserslistOptions.h5,
      },
    },
    server: {
      open: false,
      port: 4401,
    },
    debug: {
      // showRsconfig: 'x.json',
      clearLog: false,
    },
  }
})
