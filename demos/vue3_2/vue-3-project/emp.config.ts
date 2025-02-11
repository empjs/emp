import {defineConfig} from '@empjs/cli'
import Vue3 from '@empjs/plugin-vue3'
import {externalVue, pluginRspackEmpShare} from '@empjs/share/rspack'
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
        remotes: {
          '@v2b': `vue2Base@${vue2Base}`,
        },
        empRuntime: {
          runtime: {
            lib: `https://cdn.jsdelivr.net/npm/@empjs/share@3.6.0/output/sdk.js`,
          },
          
          framework: {
            libs: [
              `https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.runtime.global${store.mode === 'production' ? '.prod' : ''}.min.js`,
              `https://unpkg.com/@empjs/cdn-vue@0.2.0/dist/vue.${store.mode}.umd.js`
            //  `https://cdn.jsdelivr.net/npm/vue-router@4.5.0/dist/vue-router.global.prod.js`, //如果需要用到 vue-router
              ],
            global: 'window',
          },
          setExternals: externalVue,
        }
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
