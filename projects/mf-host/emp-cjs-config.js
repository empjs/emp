// import pluginEmpRuntime from '@empjs/plugin-emp-runtime'
import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'

const defaultFn = defineConfig(store => {
  const ip = store.getLanIp()
  const runtimeHost = `http://${ip}:3011`
  return {
    plugins: [pluginReact()],
    html: {
      template: 'src/index.html',
    },
    // build: {
    //   target: 'es2015',
    // },
    server: {
      port: 8001,
    },
    debug: {
      // clearLog: false,
      // showRsconfig: 'rs.config.json',
      // showRsconfig: true,
    },
    // externals: {'@empjs/plugin-emp-runtime': 'EmpShareLib'},
    empShare: {
      name: 'mfHost',
      dts: true,
      fastMode: {
        runtimeHost,
        //不同版本react 不能设置 防止被篡改
        framework: '',
      },
      shared: {
        react: {
          requiredVersion: '^18.2.0',
        },
        'react-dom': {
          requiredVersion: '^18.2.0',
        },
      },
    },
  }
})
export default defaultFn
