import {defineConfig} from '@empjs/cli'
import vue from '@empjs/plugin-vue2'
export default defineConfig(store => {
  const deps = store.im
  return {
    plugins: [vue()],
    html: {
      title: 'EMP3 vue2 base',
    },
    server: {port: 9001},
    appEntry: 'main.js',
    empShare: {
      name: 'vue2Base',
      exposes: {
        './Content': './src/components/Content',
        './Table': './src/components/table',
        './CompositionApi': './src/components/CompositionApi',
        './store': './src/store',
      },
      shareLib: {
        vue: 'Vue@https://unpkg.com/vue@2.7.14/dist/vue.min.js',
        vuex: `Vuex@https://unpkg.com/vuex@3.6.2/dist/vuex.min.js`,
        'element-ui': [
          'ELEMENT@https://unpkg.com/element-ui/lib/index.js',
          `https://unpkg.com/element-ui/lib/theme-chalk/index.css`,
        ],
      },
    },
    debug: {
      // showRsconfig: true,
      clearLog: false,
    },
  }
})
