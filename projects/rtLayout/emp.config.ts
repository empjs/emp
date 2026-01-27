import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {pluginRspackEmpShare} from '@empjs/share'

const globalVal = 'BIGO_NOVA_REACT'
export default defineConfig(store => {
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: 'rtLayout',
        manifest: true,
        exposes: {
          './App': './src/App',
          './logo': './src/logo',
        },
        shared: {
          react: {
            singleton: true,
          },
          'react-dom': {
            singleton: true,
          },
        },
        dev: false,
        empRuntime: {
          framework: {
            global: globalVal,
            libs: [`https://cdn.jsdelivr.net/npm/@empjs/cdn-react-wouter@0.0.2/dist/reactRouter.${store.mode}.umd.js`],
          },
          runtime: {
            lib: `https://cdn.jsdelivr.net/npm/@empjs/share@3.12.0/output/sdk.js`,
          },
          setExternals(o) {
            o.react = `${globalVal}.React`
            o['react-dom'] = `${globalVal}.ReactDOM`
            o['react/jsx-dev-runtime'] = `${globalVal}`
            o['react/jsx-runtime'] = `${globalVal}`
            o['react-dom/client'] = `${globalVal}`
            o.wouter = `${globalVal}.Wouter`
          },
        },
      }),
    ],
    server: {
      port: 4004,
      open: false,
    },
    // chain(chain) {
    //   chain.plugin('module-federation-enhanced').use(
    //     new ModuleFederationPlugin({
    //       name: 'rtProvider',
    //       // filename: 'emp.js',
    //       exposes: {
    //         './App': './src/App',
    //       },
    //       remotes: {
    //         // remoteApp: 'remoteApp@http://localhost:4001/remoteEntry.js',
    //       },
    //       shared: {
    //         react: {
    //           singleton: true,
    //         },
    //         'react-dom': {
    //           singleton: true,
    //         },
    //       },
    //     }),
    //   )
    // },
    debug: {
      clearLog: false,
      // showRsconfig: 'log.json',
    },
  }
})
