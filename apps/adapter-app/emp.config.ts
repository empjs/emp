import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {externalReact, pluginRspackEmpShare} from '@empjs/share'

export default defineConfig(store => {
  const isDeploy = store.cliOptions.envVars?.deploy === 'cloudflare'
  const ip = store.server.ip
  const port = 7702
  const base = isDeploy ? `/adapter-app/` : `http://${ip}:${port}/`
  const remotesfn = (scopeName, {port, projectName, entry = 'emp.json'}) => {
    const host = isDeploy ? `https://emp-share.empjs.dev/${projectName}` : `http://${ip}:${port}`
    return `${scopeName}@${host}/${entry}`
  }
  //
  return {
    base,
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: 'adapterApp',
        exposes: {},
        experiments: {
          asyncStartup: true,
        },
        remotes: {
          ah: remotesfn('adapterHost', {port: 7701, projectName: 'adapter-host'}),
          v3h: remotesfn('vue3Base', {port: 9301, projectName: 'vue-3-base', entry: 'emp.js'}),
          v2h: remotesfn('vue2Base', {port: 9001, projectName: 'vue-2-base', entry: 'emp.js'}),
        },
        // dts: {
        //   consumeTypes: true,
        // },
        empRuntime: {
          framework: {
            global: 'EMP_ADAPTER_REACT',
            libs: [
              `https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js`,
              `https://unpkg.com/@empjs/cdn-vue-router-pinia@3.5.0/dist/vueRouter.${store.mode}.umd.js`,
              `https://unpkg.com/@empjs/cdn-vue@0.2.1/dist/vueRouter.${store.mode}.umd.js`,
              // `http://${ip}:2300/vueRouter.${store.mode}.umd.js`,
            ],
          },
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.10.1/output/sdk.js`,
          },
          // setExternals: externalReact,
        },
      }),
    ],
    define: {ip, port, isDeploy},
    build: {
      polyfill: {
        entryCdn: 'https://unpkg.com/@empjs/polyfill@0.0.2/dist/es.js',
      },
    },
    server: {
      port,
      open: false,
      client: {
        overlay: false,
      },
    },
    debug: {
      // showRsconfig: 'log.json',
      clearLog: false,
    },
    cache: false,
  }
})
