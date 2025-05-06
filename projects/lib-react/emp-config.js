import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
export default defineConfig(store => {
  const port = 3301
  return {
    plugins: [pluginReact()],
    base: `http://localhost:${port}/`,
    html: {
      title: 'Lib React',
    },
    server: {
      port,
    },
    build: {
      chunkIds: 'named',
    },
    empShare: {
      name: 'libReact',
      exposes: {
        // './ensureUsed': './src/index',
        '.': './src/index',
      },
      shared: {
        react: {
          singleton: true,
        },
        'react/': {
          singleton: true,
        },
        'react-dom': {
          singleton: true,
        },
        'react-dom/': {
          singleton: true,
        },
      },
    },
  }
})
