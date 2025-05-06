import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
export default defineConfig(async store => {
  return {
    plugins: [pluginReact()],
    server: {
      port: 3012,
    },
    debug: {
      // showRsconfig: '.rs.config.json',
    },
    empShare: {
      name: 'app2',
      library: {type: 'var', name: 'app2'},
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/components/Button',
        './ModernComponent': './src/components/ModernReactComponent',
        './newReact': './src/react-expose',
        './newReactDOM': './src/react-dom-expose',
      },
      shared: [
        'react-dom',
        {
          react: {
            import: 'react', // the "react" package will be used a provided and fallback module
            shareScope: 'modern', // share scope with this name will be used
            singleton: true, // only a single version of the shared module is allowed
          },
        },
      ],
    },
  }
})
