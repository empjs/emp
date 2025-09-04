import {defineConfig} from '@empjs/cli'
import lightningcss from '@empjs/plugin-lightningcss'
import Vue3 from '@empjs/plugin-vue3'
import {externalVue, pluginRspackEmpShare} from '@empjs/share'
export default defineConfig(store => {
  return {
    build: {
      polyfill: {
        entryCdn: 'https://unpkg.com/@empjs/polyfill@0.0.2/dist/es.js',
      },
    },
    plugins: [
      Vue3(),
      lightningcss(),
      pluginRspackEmpShare({
        empRuntime: {
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.9.3/output/sdk.js`,
            global: `EMP_SHARE_RUNTIME`,
          },
          framework: {
            libs: [
              `https://cdn.jsdelivr.net/npm/vue@3.5.21/dist/vue.runtime.global${store.mode === 'production' ? '.prod' : ''}.min.js`,
            ],
            global: 'window',
          },
          setExternals: externalVue,
        },
        exposes: {
          './ButtonComponent': './src/components/ButtonComponent',
          './TableComponent': './src/components/TableComponent',
          './JSXComponent': './src/components/JSXComponent',
          './TsxScript': './src/components/TsxScript',
          './Antd': './src/Antd',
          './Home': './src/Home',
        },
        name: 'vue3Base',
      }),
    ],
    // tsCheckerRspackPlugin: true,
    appEntry: 'main.ts',
    server: {port: 9301, open: false},

    html: {
      title: 'EMP Vue3 Base',
      template: 'src/index.html',
    },
    debug: {
      clearLog: false,
      showRsconfig: false,
    },
  }
})
