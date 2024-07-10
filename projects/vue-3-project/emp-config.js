import Vue3 from '@empjs/plugin-vue3'
import {defineConfig} from '@empjs/cli'

export default defineConfig(({mode, env}) => {
  return {
    plugins: [Vue3()],
    appEntry: 'main.ts',
    server: {port: 9002},
    html: {title: 'EMP Vue3 Projects'},
    empShare: {
      name: 'vue3Project',
      shared: {
        vue: {
          requiredVersion: '^3',
        },
      },
      remotes: {
        '@v3': 'vue3Base@http://localhost:9001/emp.js',
      },
    },
    debug: {
      clearLog: false,
      showRsconfig: false,
    },
  }
})
