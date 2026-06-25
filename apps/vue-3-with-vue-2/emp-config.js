import {defineConfig} from '@empjs/cli'
import lightningcss from '@empjs/plugin-lightningcss'
import pluginVue3 from '@empjs/plugin-vue3'
export default defineConfig(({mode, env}) => {
  return {
    plugins: [pluginVue3(), lightningcss()],
    appEntry: 'main.ts',
    server: {port: 9311},
    html: {title: 'EMP Vue3 with Vue2'},
    empShare: {
      name: 'vue3Base',
      shared: {
        vue: {
          requiredVersion: '^3',
        },
      },
    },
    debug: {
      clearLog: false,
      showRsconfig: false,
    },
  }
})
