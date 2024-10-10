import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {pluginRspackEmpShare} from '@empjs/share'
//
export default defineConfig(store => {
  const mfhost = `https://e8e7be5c.emp-demo-react18-host.pages.dev/emp.js`
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
          framework: 'react',
          // runtimeLib: `http://${ip}:2100/index.js`,
          runtimeLib: `https://unpkg.yy.com/@empjs/share@3.1.2/output/full.js`,
        },
      }),
    ],
    server: {port: 4002},
    define: {mfhost},
    debug: {clearLog: false, showRsconfig: false},
  }
})
