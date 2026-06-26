import {defineConfig} from '@empjs/cli'
import Vue3 from '@empjs/plugin-vue3'
import {externalVue, pluginRspackEmpShare} from '@empjs/share'

// cf vue3
const deploy = process.env.DEPLOY
const isCf = deploy === 'cloudflare'
//
export default defineConfig(store => {
  const ip = store.getLanIp()
  const vue3Base = isCf ? 'https://mf-vue3.sc.empjs.dev/host/emp.js' : `http://${ip}:9301/emp.js`
  return {
    build: {
      polyfill: {
        entryCdn: 'https://unpkg.com/@empjs/polyfill@0.0.2/dist/es.js',
      },
    },
    plugins: [
      Vue3(),
      pluginRspackEmpShare({
        empRuntime: {
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.5.0/output/sdk.js`,
            global: `EMP_SHARE_RUNTIME`,
          },
          framework: {
            libs: [
              `https://unpkg.com/@empjs/cdn-vue-router-pinia@3.5.1/dist/vueRouter.${store.mode}.umd.js`,
            ],
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
          '@v3': `vue3Base@${vue3Base}`,
        },
        name: 'vue3Project',
      }),
    ],
    appEntry: 'main.ts',
    server: {port: 9302},
    html: {
      title: 'EMP Vue3 Project',
      template: 'src/index.html',
    },
    debug: {
      clearLog: false,
      showRsconfig: false,
    },
  }
})
