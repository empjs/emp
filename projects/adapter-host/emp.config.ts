import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {externalReact, pluginRspackEmpShare} from '@empjs/share'

export default defineConfig(store => {
  const isDeploy = store.cliOptions.envVars?.deploy === 'cloudflare'
  const base = isDeploy ? `/adapter-host/dist/` : '/'
  const ip = store.server.ip
  const port = 7701
  return {
    base,
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: 'adapterHost',
        exposes: {
          './App': './src/App',
        },
        manifest: true,
        dts: {
          generateTypes: true,
        },
        empRuntime: {
          framework: {
            global: 'EMP_ADAPTER_REACT',
            libs: [`https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js`],
          },
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.10.1/output/sdk.js`,
          },
          setExternals: externalReact,
        },
      }),
    ],
    define: {ip, port},
    build: {
      polyfill: {
        entryCdn: 'https://unpkg.com/@empjs/polyfill@0.0.2/dist/es.js',
      },
    },
    server: {
      port,
      open: false,
    },
    debug: {
      // showRsconfig: 'log.json',
      // clearLog: false,
    },
  }
})
