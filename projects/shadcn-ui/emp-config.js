import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
export default defineConfig(store => {
  return {
    plugins: [pluginReact()],
    html: {
      title: 'shadcn-ui',
    },
    css: {
      postcss: ['tailwindcss', 'autoprefixer'],
    },
    debug: {
      showRsconfig: true,
      clearLog: false,
    },
  }
})
