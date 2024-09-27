import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {pluginRspackEmpShare} from '@empjs/share'
export default defineConfig(store => {
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: `runtimeHost`,
        exposes: {
          './App': './src/App',
        },
        empRuntime: {
          runtimeLib: `https://unpkg.yy.com/@empjs/share@3.1.5/output/sdk.js`,
          frameworkLib: `https://unpkg.yy.com/@empjs/libs-18@0.0.1/dist`,
          frameworkGlobal: 'EMP_ADAPTER_REACT',
          framework: 'react',
        },
      }),
    ],
    build: {
      
      polyfill: {
        entryCdn: `https://unpkg.yy.com/@empjs/polyfill@0.0.1/dist/es.js`,
      },
    },
    server: {
      port: 1802,
      open: false,
    },
  }
})
