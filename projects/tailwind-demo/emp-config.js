import { defineConfig } from '@empjs/cli'
import pluginPostcss from '@empjs/plugin-postcss'
import pluginReact from '@empjs/plugin-react'
export default defineConfig(store => {
  return {
    plugins: [pluginReact(), pluginPostcss()],
    html: {
      title: 'tailwind ui demo',
    },
    debug: {
      showRsconfig: true,
      // clearLog: false,
    },
    cache: false,

  }
})
