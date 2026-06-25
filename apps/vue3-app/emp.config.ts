import {defineConfig} from '@empjs/cli'
import Vue3 from '@empjs/plugin-vue3'
import {pluginRspackEmpShare} from '@empjs/share'
export default defineConfig(store => {
  return {
    build: {
      polyfill: {
        entryCdn: 'https://unpkg.com/@empjs/polyfill@2025.9.12/dist/c71.js',
      },
    },
    plugins: [
      Vue3(),
      pluginRspackEmpShare({
        empRuntime: {
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.10.1/output/sdk.js`,
            global: `EMP_SHARE_RUNTIME`,
          },
          framework: {
            libs: [`https://unpkg.com/@empjs/cdn-vue-router-pinia@3.5.0/dist/vueRouter.${store.mode}.umd.js`],
            global: 'EMP_ADAPTER_VUE',
          },
          setExternals(o) {
            o['vue'] = `EMP_ADAPTER_VUE.Vue`
            o['vue-router'] = `EMP_ADAPTER_VUE.VueRouter`
            o['pinia'] = `EMP_ADAPTER_VUE.Pinia`
            return o
          },
        },
        remotes: {
          v3h: `vue3Host@http://${store.server.host}:9901/emp.json`,
        },
        // dts: {
        //   generateTypes: false,
        //   consumeTypes: true,
        // },
        name: 'vue3App',
      }),
    ],
    server: {port: 9902, open: false},
    html: {
      title: 'Vue3 App',
    },
    debug: {
      clearLog: false,
    },
  }
})
