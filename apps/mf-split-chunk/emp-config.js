import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
export default defineConfig(store => {
  const ip = store.getLanIp()
  //
  return {
    plugins: [pluginReact()],
    // html: {
    //   files: {
    //     js: ['https://yo-debug-test.yy.com/target.js'],
    //   },
    // },
    build: {
      polyfill: 'usage',
    },
    server: {
      port: 9001,
    },
    debug: {
      clearLog: false,
      showRsconfig: false,
    },
    empShare: {
      name: 'mf_split_chunk',
      exposes: {
        './App': './src/App',
      },
    },
  }
})
