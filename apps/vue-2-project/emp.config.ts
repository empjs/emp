import {defineConfig} from '@empjs/cli'
import vue from '@empjs/plugin-vue2'
import {pluginRspackEmpShare} from '@empjs/share'

// cf 1
const deploy = process.env.DEPLOY
const isCf = deploy === 'cloudflare'
//
export default defineConfig(store => {
  const ip = store.getLanIp()
  const vue2Base = isCf ? 'https://mf-vue2.sc.empjs.dev/host/emp.js' : `http://${ip}:9001/emp.js`
  const vue3Base = `http://${ip}:9301/emp.js`
  return {
    plugins: [
      vue(),
      pluginRspackEmpShare({
        name: 'vue2Base',
        remotes: {
          '@v2b': `vue2Base@${vue2Base}`,
          '@v3b': `vue3Base@${vue3Base}`,
        },
        // shared: ['vue', 'vuex'],
        empRuntime: {
          runtimeLib: `http://${store.server.ip}:2100/sdk.js`,
          framework: {
            libs: [
              `https://unpkg.com/@empjs/cdn-vue@0.2.1/dist/vueRouter.${store.mode}.umd.js`,
              `data:text/javascript,window.Vue%3Dwindow.EMP_ADAPTER_VUE_v2.Vue%3B`,
              `https://unpkg.com/@empjs/cdn-vue-router-pinia@3.5.1/dist/vueRouter.${store.mode}.umd.js`,
              `https://unpkg.com/element-ui/lib/index.js`,
              `https://unpkg.com/element-ui/lib/theme-chalk/index.css`,
            ],
            global: 'EMP_ADAPTER_VUE_v2',
          },
          setExternals(o) {
            o['vue'] = `EMP_ADAPTER_VUE_v2.Vue`
            o['vuex'] = `EMP_ADAPTER_VUE_v2.Vuex`
            o['vue-router'] = `EMP_ADAPTER_VUE_v2.VueRouter`
            // console.log(o)
            return o
          },
          // shareLib: {
          //   vue: 'Vue@https://unpkg.com/vue@2.7.14/dist/vue.min.js',
          //   vuex: `Vuex@https://unpkg.com/vuex@3.6.2/dist/vuex.min.js`,
          //   'element-ui': [
          //     'ELEMENT@https://unpkg.com/element-ui/lib/index.js',
          //     `https://unpkg.com/element-ui/lib/theme-chalk/index.css`,
          //   ],
          // },
          // framework: 'vue2',
        },
      }),
    ],
    html: {
      title: 'EMP3 vue2 project',
    },
    server: {port: 9002},
    appEntry: 'main.js',
  }
})
