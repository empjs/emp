import {defineConfig} from '@empjs/cli'
import Vue3 from '@empjs/plugin-vue3'
import {externalVue, pluginRspackEmpShare} from '@empjs/share'
import pkg from './package.json'

const vueVersion = pkg.dependencies.vue.replace('^', '')
const vueRouterVersion = pkg.dependencies['vue-router'].replace('^', '')
const piniaVersion = pkg.dependencies.pinia.replace('^', '')
export default defineConfig(store => {
  return {
    defineFix: 'all',
    define: {
      vueVersion,
      vueRouterVersion,
      piniaVersion,
    },
    build: {
      polyfill: {
        // mode: 'usage',
        // browserslist: store.browserslistOptions.h5,
        entryCdn: 'https://unpkg.com/@empjs/polyfill@2025.9.12/dist/c71.js',
      },
    },
    plugins: [
      Vue3(),
      pluginRspackEmpShare({
        manifest: true,
        exposes: {
          './Info': './src/components/Info.vue',
          './Count': './src/components/Count.vue',
          './Home': './src/components/Home.vue',
        },
        empRuntime: {
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.10.1/output/sdk.js`,
            global: `EMP_SHARE_RUNTIME`,
          },
          framework: {
            libs: [
              `http://${store.server.ip}:2300/vueRouter.${store.mode}.umd.js`,
              // `https://unpkg.com/@empjs/cdn-vue-router-pinia@3.5.0/dist/vueRouter.${store.mode}.umd.js`,
            ],
            global: 'EMP_ADAPTER_VUE',
            // global: 'window',
          },
          setExternals(o) {
            o['vue'] = `EMP_ADAPTER_VUE.Vue`
            o['vue-router'] = `EMP_ADAPTER_VUE.VueRouter`
            o['pinia'] = `EMP_ADAPTER_VUE.Pinia`
            return o
          },
        },
        remotes: {},
        name: 'vue3Host',
        // dts: {
        //   generateTypes: {
        //     compilerInstance: 'vue-tsc',
        //     compileInChildProcess: false,
        //   },
        //   consumeTypes: false,
        // },
      }),
    ],
    server: {
      port: 9901,
      open: false,
      client: {
        overlay: false,
      },
    },
    html: {
      title: 'Vue3 Host',
      // template: 'src/setup/index.html',
    },
    debug: {
      clearLog: false,
      // showRsconfig: 'x.json',
    },
  }
})
