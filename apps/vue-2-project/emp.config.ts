import {defineConfig} from '@empjs/cli'
import vue from '@empjs/plugin-vue2'
import {pluginRspackEmpShare} from '@empjs/share'

// cf 1
const deploy = process.env.DEPLOY
const isCf = deploy === 'cloudflare'
//
export default defineConfig(store => {
  const ip = store.getLanIp()
  const vue2Base = isCf ? 'https://mf-vue2.sc.empjs.dev/host/emp.js' : `http://${ip}:9001/emp.js`
  return {
    plugins: [
      vue(),
      pluginRspackEmpShare({
        name: 'vue2Base',
        remotes: {
          '@v2b': `vue2Base@${vue2Base}`,
        },
        // shared: ['vue', 'vuex'],
        empRuntime: {
          // runtimeLib: `https://unpkg.com/@empjs/share@3.1.5/output/sdk.js`,
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
          // framework: 'vue2',
        },
      }),
    ],
    html: {
      title: 'EMP3 vue2 project',
    },
    server: {port: 9002},
    appEntry: 'main.js',
  }
})
