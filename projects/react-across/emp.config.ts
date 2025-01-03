import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {pluginRspackEmpShare} from '@empjs/share/rspack'
export default defineConfig(store => {
  const {cliOptions} = store
  let env = cliOptions.envVars.v
  let port: any = `${env}00`
  if (cliOptions.envVars.v === 'c1') {
    env = `17`
    port = `2100`
  } else if (cliOptions.envVars.v === 'c2') {
    env = `17`
    port = `2200`
  }
  const reactVersion = Number(env)
  port = Number(port)
  return {
    plugins: [
      pluginReact({
        version: reactVersion,
      }),
      pluginRspackEmpShare({
        empRuntime: {
          runtime: {
            lib: `/sdk.js`,
            global: `EMP_SHARE_RUNTIME`,
          },
          framework: {
            name: 'react',
            version: reactVersion,
            entry: 'react',
            global: 'EMP_ADAPTER_REACT',
            lib: `/${reactVersion}`,
          },
        },
        exposes: {
          './Component': './src/Component',
        },
        name: `c${port}`,
      }),
    ],
    server: {
      port,
      open: false,
    },
    define: {ip: store.server.ip, port},
    debug: {
      clearLog: false,
    },
  }
})
