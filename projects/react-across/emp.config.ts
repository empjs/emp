import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {externalReact, pluginRspackEmpShare} from '@empjs/share/rspack'
export default defineConfig(store => {
  const {cliOptions} = store
  const env = cliOptions.envVars.v
  let port: any = `${env}00`

  const reactVersion = Number(env)
  port = Number(port)
  const projectName = `c${port}`
  return {
    // base: store.mode === 'development' ? undefined : projectName,
    build: {
      outDir: `dist/${projectName}`,
    },
    plugins: [
      pluginReact({
        version: reactVersion,
      }),
      pluginRspackEmpShare({
        empRuntime: {
          runtime: {
            lib: `/share/sdk.js`,
            global: `EMP_SHARE_RUNTIME`,
          },
          framework: {
            libs: [`/${reactVersion}/react.${store.mode}.umd.js`],
          },
          setExternals(o) {
            externalReact(o, 'EMP_ADAPTER_REACT')
            return o
          },
        },
        exposes: {
          './Component': './src/Component',
        },
        name: projectName,
      }),
    ],
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
