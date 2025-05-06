import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {pluginRspackEmpShare} from '@empjs/share'
//
const deploy = process.env.DEPLOY
const isCf = deploy === 'cloudflare'
//
export default defineConfig(store => {
  const ip = store.getLanIp()
  const mfhost = `http://${ip}:6001/emp.js`
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        empRuntime: {
          frameworkLib: `http://${ip}:1800`,
          frameworkGlobal: 'EMP_ADAPTER_REACT',
          framework: 'react',
          runtimeLib: `http://${ip}:2100/full.js`,
          // injectGlobalValToHtml: false,
        },
      }),
    ],
    server: {port: 5200},
    define: {mfhost},
    debug: {clearLog: false, showRsconfig: false},
  }
})
