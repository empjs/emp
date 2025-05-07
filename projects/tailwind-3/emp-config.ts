import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import pluginTailwindcss from '@empjs/plugin-tailwindcss3'
import {externalReact, pluginRspackEmpShare} from '@empjs/share/rspack'

export default defineConfig(store => {
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        empRuntime: {
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.5.3/output/sdk.js`,
          },
          framework: {
            libs: [`https://unpkg.com/@empjs/cdn-react@0.19.0/dist/reactRouter.${store.mode}.umd.js`],
            global: 'EMP_ADAPTER_REACT',
          },
          setExternals: externalReact,
        },
      }),
      pluginTailwindcss({
        content: ['./src/**/*.{js,ts,jsx,tsx}'],
        theme: {
          extend: {},
        },
        plugins: [],
      }),
    ],
    build: {
      polyfill: {
        mode: 'entry',
        entryCdn: 'https://unpkg.com/@empjs/polyfill@0.0.2/dist/es.js',
        browserslist: store.browserslistOptions.h5,
      },
      sourcemap: true,
    },
    html: {
      title: 'tailwind 3 demo',
      // template: 'src/index.html',
    },
    debug: {},
    server: {
      open: false,
      // client: {
      //   logging: 'verbose', // 输出详细日志
      // },
    },
  }
})
