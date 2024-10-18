import {defineConfig} from '@empjs/cli'
import Vue3 from '@empjs/plugin-vue3'
import {pluginRspackEmpShare} from '@empjs/share'
// cf vue3
const deploy = process.env.DEPLOY
const isCf = deploy === 'cloudflare'
//
export default defineConfig(store => {
  const ip = store.getLanIp()
  const vue3Base = isCf ? 'https://mf-vue3.sc.empjs.dev/host/emp.js' : `http://${ip}:9301/emp.js`
  return {
    plugins: [
      Vue3(),
      pluginRspackEmpShare({
        name: 'vue3Project',
        shared: {
          vue: {
            requiredVersion: '^3',
          },
        },
        remotes: {
          '@v3': `vue3Base@${vue3Base}`,
        },
      }),
    ],
    appEntry: 'main.ts',
    server: {port: 9302},
    html: {title: 'EMP Vue3 Projects'},
    debug: {
      clearLog: false,
      showRsconfig: false,
    },
  }
})
