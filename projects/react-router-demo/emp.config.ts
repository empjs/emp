import {defineConfig, empHelper, rspack} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
export default defineConfig(store => {
  return {
    plugins: [pluginReact()],
    debug: {
      showPerformance: true,
    },
    server: {
      https: true,
    },
  }
})
