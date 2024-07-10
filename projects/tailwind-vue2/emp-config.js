import {defineConfig} from '@empjs/cli'
import vue from '@empjs/plugin-vue2'
export default defineConfig(store => {
  return {
    plugins: [vue()],
    html: {
      title: 'EMP3 vue2 project',
    },
    server: {port: 9002},
    appEntry: 'main.js',
    empShare: {
      name: 'vue2Base',
      // remotes: {
      //   '@v2b': 'vue2Base@http://localhost:9001/emp.js',
      // },
      shareLib: {
        vue: 'Vue@https://unpkg.com/vue@2.7.14/dist/vue.min.js',
        vuex: `Vuex@https://unpkg.com/vuex@3.6.2/dist/vuex.min.js`,
        'element-ui': [
          'ELEMENT@https://unpkg.com/element-ui/lib/index.js',
          `https://unpkg.com/element-ui/lib/theme-chalk/index.css`,
        ],
      },
    },
  }
})
