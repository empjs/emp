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
        // entryCdn: 'https://unpkg.com/@empjs/polyfill@0.0.2/dist/es.js',
      },
    },
    plugins: [
      Vue3(),
      // pluginRspackEmpShare({
      //   empRuntime: {
      //     runtime: {
      //       lib: `https://unpkg.com/@empjs/share@3.5.0/output/sdk.js`,
      //       global: `EMP_SHARE_RUNTIME`,
      //     },
      //     framework: {
      //       libs: [
      //         `https://cdn.jsdelivr.net/npm/vue@${vueVersion}/dist/vue.runtime.global${store.mode === 'production' ? '.prod' : ''}.min.js`,
      //         // `https://cdn.jsdelivr.net/npm/vue-router@4.5.0/dist/vue-router.global.min.js`,
      //         `https://cdn.jsdelivr.net/npm/vue-router@${vueRouterVersion}/dist/vue-router.global.prod.js`,
      //       ],
      //       global: 'window',
      //     },
      //     setExternals(o) {
      //       o['vue'] = `Vue`
      //       o['vue-router'] = `VueRouter`
      //       return o
      //     },
      //   },
      //   remotes: {},
      //   name: 'vue3Project',
      // }),
    ],
    server: {port: 9901,open:false},
    html: {
      title: 'Vue3 Host',
      template: 'src/setup/index.html',
    },
    debug: {
      clearLog: false,
      showRsconfig: false,
    },
  }
})
