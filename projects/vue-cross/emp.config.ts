import {defineConfig} from '@empjs/cli'
import pluginVue2 from '@empjs/plugin-vue2'
import pluginVue3 from '@empjs/plugin-vue3'
import {externalReact, pluginRspackEmpShare} from '@empjs/share/rspack'
export default defineConfig(store => {
  const {cliOptions} = store
  const env = cliOptions.envVars.v
  let port: any = `200${env}`

  const version = Number(env)
  port = Number(port)
  const projectName = `c${port}`
  return {
    // base: store.mode === 'development' ? undefined : projectName,
    build: {
      outDir: `dist/${projectName}`,
    },
    plugins: [
      version === 2 ? pluginVue2() : pluginVue3(),
      pluginRspackEmpShare({
        empRuntime: {
          runtime: {
            lib: `/share/sdk.js`,
            global: `EMP_SHARE_RUNTIME`,
          },
          framework: {
            libs: [
              version === 2
                ? `https://cdn.jsdelivr.net/npm/vue@2.7.16/dist/vue.min.js`
                : `https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.runtime.global${store.mode === 'production' ? '.prod' : ''}.min.js`,
            ],
          },
          setExternals(o) {
            o['vue'] = 'window.Vue'
            return o
          },
        },
        name: projectName,
      }),
    ],
    appEntry: `vue${version}/index.ts`,
    server: {
      port,
      open: false,
    },
    define: {ip: store.server.ip, port, mode: store.mode},
    debug: {
      clearLog: false,
    },
  }
})
