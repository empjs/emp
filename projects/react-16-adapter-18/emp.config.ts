import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {pluginRspackEmpShare} from '@empjs/share'

//
const deploy = process.env.DEPLOY
const isCf = deploy === 'cloudflare'
const useLocal = true
//
export default defineConfig(store => {
  const ip = store.server.ip
  const mfhost = isCf ? 'https://mf-cjs.sc.empjs.dev/host/emp.js' : `http://${ip}:6001/emp.json`
  const runtimeLib = useLocal ? `http://${ip}:2100/sdk.js` : `https://unpkg.com/@empjs/share@3.5.2/output/sdk.js`
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        empRuntime: {
          runtime: {
            lib: runtimeLib,
          },
          framework: {
            global: 'EMP_ADAPTER_REACT', //
            // libs: [`https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js`],
            libs: [`https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.development.umd.js`], //不用 react 版本 基站dev时 需要切到 development 保持 远程热更
          },
        },
      }),
    ],
    server: {port: 4002},
    define: {mfhost},
    debug: {clearLog: false, showRsconfig: false},
  }
})
