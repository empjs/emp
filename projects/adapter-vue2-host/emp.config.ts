import {defineConfig} from '@empjs/cli'
import Vue2 from '@empjs/plugin-vue2'
import {externalVue, pluginRspackEmpShare} from '@empjs/share'
import pkg from './package.json'

const vueVersion = pkg.dependencies.vue.replace('^', '')
const vueRouterVersion = pkg.dependencies['vue-router'].replace('^', '')
const vuexVersion = pkg.dependencies.vuex.replace('^', '')
export default defineConfig(store => {
  return {
    defineFix: 'all',
    define: {
      vueVersion,
      vueRouterVersion,
      vuexVersion,
    },
    build: {
      polyfill: {
        entryCdn: 'https://unpkg.com/@empjs/polyfill@2025.9.12/dist/c71.js',
      },
    },
    plugins: [
      Vue2(),
      pluginRspackEmpShare({
        manifest: true,
        exposes: {
          './Info': './src/components/Info.vue',
          './Home': './src/components/Home.vue',
        },
        empRuntime: {
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.10.1/output/sdk.js`,
            global: `EMP_SHARE_RUNTIME`,
          },
          framework: {
            libs: [
              `https://unpkg.com/@empjs/cdn-vue-2@3.5.0/dist/vueRouter.${store.mode}.umd.js`,
            ],
            global: 'EMP_ADAPTER_VUE',
          },
          setExternals(o) {
            o['vue'] = `EMP_ADAPTER_VUE.Vue`
            o['vue-router'] = `EMP_ADAPTER_VUE.VueRouter`
            o['vuex'] = `EMP_ADAPTER_VUE.Vuex`
            return o
          },
        },
        remotes: {},
        name: 'vue2Host',
      }),
    ],
    server: {
      port: 9902,
      open: false,
      client: {
        overlay: false,
      },
    },
    html: {
      title: 'Vue2 Host',
    },
    debug: {
      clearLog: false,
    },
  }
})