import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
//
const deploy = process.env.DEPLOY
const isCf = true
//
export default defineConfig(store => {
  const ip = store.getLanIp()
  const mfhost = `http://${ip}:8001/emp.js`
  // const runtimeHost = `http://${ip}:3011`
  const runtimeHost = `https://df-react.sc.empjs.dev/lib`
  return {
    html: {
      title: 'Federation Runtime',
      meta: {
        charset: {charset: 'utf-8'},
        'http-equiv': {'http-equiv': 'X-UA-Compatible', content: 'IE=edge'},
        viewport: {
          content: 'width=device-width,initial-scale=1',
          name: 'viewport',
        },
      },
    },
    plugins: [pluginReact()],
    server: {port: 4002},
    define: {mfhost},
    debug: {clearLog: false, showRsconfig: false},
    // externals: {'@empjs/plugin-emp-runtime': 'EmpShareLib'},
    empShare: {
      fastMode: {
        runtimeHost,
        //不同版本react 不能设置 防止被篡改
        framework: '',
      },
    },
  }
})
