import {defineConfig} from '@empjs/cli'
import lightningcss from '@empjs/plugin-lightningcss'
import Vue3 from '@empjs/plugin-vue3'
import {pluginRspackEmpShare} from '@empjs/share'
export default defineConfig(() => {
  return {
    plugins: [
      Vue3(),
      lightningcss(),
      pluginRspackEmpShare({
        name: 'vue3Base',
        // dts: {
        //   consumeTypes: true,
        //   generateTypes: {
        //     compilerInstance: 'vue-tsc',
        //   },
        // },
        shared: {
          vue: {
            requiredVersion: '^3',
          },
        },
        exposes: {
          './ButtonComponent': './src/components/ButtonComponent',
          './TableComponent': './src/components/TableComponent',
          './JSXComponent': './src/components/JSXComponent',
          './TsxScript': './src/components/TsxScript',
          './Antd': './src/Antd',
          './Home': './src/Home',
        },
      }),
    ],
    appEntry: 'main.ts',
    server: {port: 9301, open: false},
    html: {title: 'EMP Vue3 Base'},
    debug: {
      clearLog: false,
      showRsconfig: false,
    },
  }
})
