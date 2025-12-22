import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {tanstackRouter} from '@tanstack/router-plugin/rspack'

//
const cdnHost = 'https://cdn.jsdelivr.net/npm'
// const cdnHost = 'https://unpkg.com'
const globalVal = 'EMP_REACT_19_TANSTACK'
//
export default defineConfig(store => {
  return {
    base: '/',
    plugins: [
      pluginReact({
        import: {
          // src: `http://localhost:2200/reactRouter.${store.mode}.umd.js`,
          src: `${cdnHost}/@empjs/cdn-react-tanstack@0.19.2/dist/reactRouter.${store.mode}.umd.js`,
          externals: {
            react: `${globalVal}.React`,
            'react-dom': `${globalVal}.ReactDOM`,
            'react/jsx-dev-runtime': `${globalVal}`,
            'react/jsx-runtime': `${globalVal}`,
            'react-dom/client': `${globalVal}`,
            '@tanstack/react-router': `${globalVal}.ReactRouterDOM`,
          },
        },
      }),
    ],
    chain(config) {
      config.plugin('tanstack-router').use(
        tanstackRouter({
          target: 'react',
          autoCodeSplitting: true,
        }),
      )
    },
    server: {
      port: 2201,
      open: false,
    },
  }
})
