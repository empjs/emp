import {defineConfig} from '@empjs/cli'
import pluginlightningcss from '@empjs/plugin-lightningcss'
import pluginReact from '@empjs/plugin-react'

export default defineConfig(store => {
  return {
    autoPages: true,
    plugins: [pluginReact(), pluginlightningcss()],
    debug: {
      clearLog: false,
      // showRsconfig: true,
    },
    html: {
      title: 'EMP v3 Auto Pages',
    },
    entries: {
      'work.tsx': {
        title: 'auto page work',
      },
    },
  }
})
