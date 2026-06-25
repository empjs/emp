import {defineConfig} from '@empjs/cli'
import vue from '@empjs/plugin-vue2'
import {pluginRspackEmpShare} from '@empjs/share'
export default defineConfig(store => {
  return {
    plugins: [
      vue(),
      pluginRspackEmpShare({
        name: 'vue2App',
        remotes: {},
        empRuntime: {
          runtimeLib: `https://unpkg.com/@empjs/share@3.10.1/output/sdk.js`,
          framework: {
            libs: [
              `https://unpkg.com/vue@2.7.14/dist/vue.min.js`,
              `https://unpkg.com/vuex@3.6.2/dist/vuex.min.js`,
              `https://unpkg.com/element-ui/lib/index.js`,
              `https://unpkg.com/element-ui/lib/theme-chalk/index.css`,
            ],
            global: 'window',
          },
          setExternals(o) {
            o['vue'] = `Vue`
            o['vuex'] = `Vuex`
            return o
          },
        },
      }),
    ],
    html: {
      title: 'vue2App',
      template: 'src/index.html',
    },
    server: {port: 9903},
    define: {ip: `${store.server.ip}`},
  }
})
