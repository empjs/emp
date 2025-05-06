import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
export default defineConfig(store => {
  const port = 3302
  return {
    plugins: [pluginReact()],
    base: `http://localhost:${port}/`,
    html: {
      title: 'Lib Main',
    },
    build: {
      chunkIds: 'named',
    },
    server: {
      port,
    },
    empShare: {
      name: 'libMain',
      remotes: {
        libReact: 'libReact@http://localhost:3301/emp.js',
      },
    },
  }
})
