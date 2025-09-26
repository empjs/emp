import {defineConfig} from '@empjs/cli'
import vue from '@empjs/plugin-vue2'
import {pluginRspackEmpShare} from '@empjs/share'
import pkg from './package.json'
export default defineConfig(store => {
  const isDeploy = store.cliOptions.envVars?.deploy === 'cloudflare'
  const base = isDeploy ? `/adapter-vue2-host/` : '/'
  return {
    base,
    plugins: [
      vue(),
      pluginRspackEmpShare({
        name: 'vue2Host',
        // shared: ['vue', 'vuex'],
        manifest: true,
        exposes: {
          './HelloVue': './src/components/HelloVue',
          './Content': './src/components/Content',
          './Table': './src/components/table',
          './CompositionApi': './src/components/CompositionApi',
          './store': './src/store',
          './plugin': './src/plugin',
        },
        shared: {
          vue: {
            singleton: true, // 单一实例
            requiredVersion: pkg.dependencies.vue, // 与 Vue 2 版本匹配
          },
          'vue-router': {singleton: true, requiredVersion: pkg.dependencies['vue-router']}, // 如使用
          vuex: {singleton: true, requiredVersion: pkg.dependencies.vuex}, // 如使用
        },
        empRuntime: {
          runtimeLib: `https://unpkg.com/@empjs/share@3.10.1/output/sdk.js`,
          framework: {
            libs: [
              // `https://unpkg.com/vue@2.7.14/dist/vue.min.js`,
              // `https://unpkg.com/vuex@3.6.2/dist/vuex.min.js`,
              // `http://${store.server.ip}:2200/vueRouter.${store.mode}.umd.js`,
              `https://unpkg.com/@empjs/cdn-vue@0.2.1/dist/vueRouter.${store.mode}.umd.js`,
              // `https://unpkg.com/element-ui/lib/index.js`,
              // `https://unpkg.com/element-ui/lib/theme-chalk/index.css`,
            ],
            // global: 'window',
            global: 'EMP_ADAPTER_VUE_v2',
          },
          setExternals(o) {
            o['vue'] = `EMP_ADAPTER_VUE_v2.Vue`
            o['vuex'] = `EMP_ADAPTER_VUE_v2.Vuex`
            o['vue-router'] = `EMP_ADAPTER_VUE_v2.VueRouter`
            // o['element-ui'] = `ELEMENT`
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
        },
      }),
    ],
    html: {
      title: 'Vue2 host',
    },
    server: {
      port: 9902,
      open: false,
      // hot: false,
    },
    // appEntry: 'index.js',
    debug: {},
  }
})
