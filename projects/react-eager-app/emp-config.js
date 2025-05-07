import {defineConfig, dts} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
export default defineConfig(async store => {
  const ip = store.getLanIp()
  return {
    plugins: [pluginReact()],
    server: {
      port: 6002,
    },
    debug: {
      showRsconfig: false,
    },
    empShare: {
      dts: true,
      name: 'react_eger_app',
      remotes: {
        react_eger_host: `react_eger_host@http://${ip}:6001/emp.js`,
        yybase: 'pcyyBase@https://unpkg.com/@webbase/yybase@1.27.5/dist/emp.js',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^17.0.2',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^17.0.2',
        },
      },
    },
  }
})
