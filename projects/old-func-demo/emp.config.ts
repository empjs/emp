import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import pluginRspackEmpShare from '@empjs/share/rspack'
export default defineConfig(store => {
  return {
    plugins: [pluginReact(), pluginRspackEmpShare({})],
    server: {
      port: 7001,
      open: true,
    },
  }
})
