import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {pluginRspackEmpShare} from '@empjs/share'
//
export default defineConfig(store => {
  const mfhost = `https://emp-demo-react18-host.pages.dev/demos/react18/react-host/dist/emp.js`
  // const mfhost = `http://localhost:1802/emp.js`
  const frameworkLib = `https://unpkg.com/@empjs/libs-18@0.0.1/dist`
  return {
    // html: {
    //   title: pkg.name,
    // },
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        empRuntime: {
          frameworkLib,
          frameworkGlobal: 'EMP_ADAPTER_REACT',
          runtimeLib: `https://unpkg.yy.com/@empjs/share@3.1.2/output/full.js`,
        },
      }),
    ],
    server: {port: 4002},
    define: {mfhost},
    debug: {clearLog: false, showRsconfig: true, showScriptDebug: true},
    lifeCycle:{
      beforeBuild(){
        console.log('== beforeBuild ==')
      }
    }
  }
})
