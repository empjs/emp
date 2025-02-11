import {defineConfig} from '@empjs/cli'
import vue from '@empjs/plugin-vue2'
import {externalVue, pluginRspackEmpShare} from '@empjs/share/rspack'

export default defineConfig(store => {
  return {
    plugins: [
      vue(),
      pluginRspackEmpShare({
        name: 'vue2Base',
        exposes: {
          './Content': './src/components/Content',
          './Table': './src/components/table',
          './CompositionApi': './src/components/CompositionApi',
          './store': './src/store',
          './Home': './src/views/Home',
        },
        empRuntime: {
          runtime: {
            lib: `https://cdn.jsdelivr.net/npm/@empjs/share@3.6.0/output/sdk.js`,
          },
          framework: {
            libs: [
              `https://cdn.jsdelivr.net/npm/vue@2.7.16/dist/vue.runtime.common${store.mode === 'production' ? '.prod' : ''}.min.js`,
            //  `https://cdn.jsdelivr.net/npm/vue-router@4.5.0/dist/vue-router.global.prod.js`, //如果需要用到 vue-router
              ],
            global: 'window',
          },
          setExternals: externalVue,
        }
      }),
    ],
    html: {
      title: 'EMP3 vue2 base',
    },
    server: {
      port: 9001,
      open: false,
    },
    appEntry: 'main.js',
    debug: {
      clearLog: false,
    },
  }
})
