import {defineConfig} from '@empjs/cli'
import Vue3 from '@empjs/plugin-vue3'
import {pluginRspackEmpShare} from '@empjs/share'
// cf vue3
const deploy = process.env.DEPLOY
const isCf = deploy === 'cloudflare'
//
export default defineConfig(store => {
  const ip = store.getLanIp()
  const vue2Base = isCf ? 'https://mf-vue3.sc.empjs.dev/host/emp.js' : `http://${ip}:9001/emp.js`
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
          '@v2b': `vue2Base@${vue2Base}`,
        },
        empRuntime: {
          runtimeLib: "https://unpkg.yy.com/@empjs/share@3.1.5/output/sdk.js",
          frameworkLib: "https://unpkg.com/@empjs/lib-vue-2@0.0.2/dist",
          // shareLib: {
          //   'element-ui': [
          //     'ELEMENT@https://unpkg.com/element-ui/lib/index.js',
          //     "https://unpkg.com/element-ui/lib/theme-chalk/index.css",
          //   ],
          // },
          framework: undefined,
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
