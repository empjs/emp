import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'

//
const cdnHost = 'https://cdn.jsdelivr.net/npm'
// const cdnHost = 'https://unpkg.com'
const globalVal = 'BIGO_NOVA_REACT'
//
export default defineConfig(store => {
  return {
    base: '/',
    plugins: [
      pluginReact({
        import: {
          // src: `http://localhost:2200/reactRouter.${store.mode}.umd.js`,
          src: `${cdnHost}/@empjs/cdn-react-wouter@0.0.2/dist/reactRouter.${store.mode}.umd.js`,
          externals: {
            react: `${globalVal}.React`,
            'react-dom': `${globalVal}.ReactDOM`,
            'react/jsx-dev-runtime': `${globalVal}`,
            'react/jsx-runtime': `${globalVal}`,
            'react-dom/client': `${globalVal}`,
            wouter: `${globalVal}.Wouter`,
          },
        },
      }),
    ],
    server: {
      port: 2200,
      open: false,
    },
  }
})
