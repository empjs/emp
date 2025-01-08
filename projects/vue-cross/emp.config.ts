import {defineConfig} from '@empjs/cli'
import type {GlobalStore} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import pluginVue2 from '@empjs/plugin-vue2'
import pluginVue3 from '@empjs/plugin-vue3'
import {pluginRspackEmpShare} from '@empjs/share/rspack'
export default defineConfig(store => {
  const {port, pluginEmpShare, pluginFramework, appEntry, name} = setup(store)
  return {
    plugins: [pluginFramework, pluginEmpShare],
    server: {
      port,
      open: false,
    },
    appEntry,
    define: {ip: store.server.ip, port, name},
    debug: {clearLog: false},
  }
})
//
const setup = (store: GlobalStore) => {
  const {cliOptions} = store
  const env = cliOptions.envVars.v
  let port: any = `${env}00`

  const exposes = {
    // './Component': './src/react/Component',
    // './Nav': './src/react/Nav',
  }
  const version = Number(env)
  //
  let frameworkName = 'react'
  let appEntry = `react/index.tsx`
  if ([2, 3].includes(version)) {
    frameworkName = 'vue'
    port = `200${version}`
  }
  port = Number(port)
  let framework: any = {
    name: frameworkName,
    version: version,
    entry: frameworkName,
    global: 'EMP_ADAPTER_REACT',
    lib: `/${frameworkName}-${version}`,
  }
  if (frameworkName === 'vue') {
    framework = {
      name: frameworkName,
      version: version,
      entry: frameworkName,
      global: 'EMP_ADAPTER_VUE',
      lib: `/${frameworkName}-${version}`,
    }
    //
    appEntry = version === 2 ? `vue/index.ts` : `vue3/index.ts`
  }
  //
  const name = `c${port}`
  return {
    name,
    port,
    version,
    appEntry,
    get pluginFramework() {
      if (frameworkName === 'vue') {
        if (version === 3) {
          return pluginVue3()
        } else if (version === 2) {
          return pluginVue2()
        }
      }
      return pluginReact({
        version,
      })
    },
    get pluginEmpShare() {
      return pluginRspackEmpShare({
        empRuntime: {
          runtime: {
            lib: `/share/sdk.js`,
            global: `EMP_SHARE_RUNTIME`,
          },
          framework,
          setExternals(o) {
            if (frameworkName === 'vue') {
              o['vue'] = version === 2 ? `EMP_ADAPTER_VUE.Vue` : `EMP_ADAPTER_VUE`
            }
            return o
          },
        },
        exposes,
        name,
      })
    },
  }
}
