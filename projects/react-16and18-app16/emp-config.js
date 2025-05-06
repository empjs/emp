import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
export default defineConfig(store => {
  return {
    plugins: [pluginReact()],
    html: {
      files: {
        js: ['//localhost:3012/remoteEntry.js'],
      },
    },
    empShare: {
      name: 'app1',
      library: {type: 'var', name: 'app1'},
      remotes: {
        app2: 'app2',
      },
      shared: {
        react: '16.14.0',
        'react-dom': {
          import: 'react-dom', // the "react" package will be used a provided and fallback module
          shareKey: 'react-dom', // under this name the shared module will be placed in the share scope
          shareScope: 'legacy', // share scope with this name will be used
          singleton: true, // only a single version of the shared module is allowed
        },
      },
    },
  }
})
