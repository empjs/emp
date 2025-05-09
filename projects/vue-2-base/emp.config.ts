import {defineConfig} from '@empjs/cli'
import vue from '@empjs/plugin-vue2'
import {pluginRspackEmpShare} from '@empjs/share'
export default defineConfig(store => {
  return {
    plugins: [
      vue(),
      pluginRspackEmpShare({
        name: 'vue2Base',
        // shared: ['vue', 'vuex'],
        exposes: {
          './Content': './src/components/Content',
          './Table': './src/components/table',
          './CompositionApi': './src/components/CompositionApi',
          './store': './src/store',
        },
        empRuntime: {
          runtimeLib: `https://unpkg.com/@empjs/share@3.6.0-beta.1/output/sdk.js`,
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
            o['element-ui'] = `ELEMENT`
            console.log(o)
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
      title: 'Vue2 base of EMP 3',
    },
    server: {
      port: 9001,
      open: false,
      // https: true
    },
    appEntry: 'main.js',
    debug: {
      // showRsconfig: true,
      // showPerformance: true,
      clearLog: false,
    },
  }
})
