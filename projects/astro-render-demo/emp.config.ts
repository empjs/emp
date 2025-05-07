import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {externalReact, pluginRspackEmpShare} from '@empjs/share/rspack'
export default defineConfig(store => {
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        empRuntime: {
          framework: {
            global: 'EMP_ADAPTER_REACT',
            libs: [`https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js`],
          },
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.6.0/output/sdk.js`,
          },
          setExternals: externalReact,
        },
        remotes: {
          '@astro/render': `Astro_Render@https://unpkg.com/@astro/render@0.6.0/dist/emp.js`,
          '@astro/ui': 'Astro_UI@https://unpkg.com/@astro/ui@0.0.1/dist/emp.json',
        },
        dts: {
          consumeTypes: true,
        },
      }),
    ],
    build: {
      polyfill: {
        entryCdn: 'https://unpkg.com/@empjs/polyfill@0.0.2/dist/es.js',
      },
    },
    server: {
      port: 3600,
      open: false,
    },
    debug: {
      clearLog: false,
    },
    html: {
      template: 'src/index.html',
    },
  }
})
