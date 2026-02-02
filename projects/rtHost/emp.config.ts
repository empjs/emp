import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
// import {ModuleFederationPlugin} from '@module-federation/rspack'
import {pluginRspackEmpShare} from '@empjs/share'

const globalVal = 'BIGO_NOVA_REACT'
export default defineConfig(store => {
  return {
    plugins: [
      pluginReact({
        // import: {
        //   src: `https://cdn.jsdelivr.net/npm/@empjs/cdn-react@0.19.0/dist/reactRouter.${store.mode}.umd.js`,
        //   externals: {
        //     React: 'EMP_ADAPTER_REACT.react',
        //     ReactDOM: 'EMP_ADAPTER_REACT.react-dom',
        //   },
        // },
      }),
      pluginRspackEmpShare({
        name: 'rtHost',
        experiments: {
          asyncStartup: true,
        },
        shared: {
          react: {
            singleton: true,
          },
          'react-dom': {
            singleton: true,
          },
        },
        dts: {
          consumeTypes: true,
          generateTypes: false,
        },
        forceRemotes: {
          rtLayout: '$@http://127.0.0.1:4004/emp.json',
        },
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
    build: {
      target: 'es2017',
    },
    server: {
      port: 4000,
      open: false,
    },
    /* chain(chain) {
      chain.plugin('module-federation-enhanced').use(
        new ModuleFederationPlugin({
          name: 'rtHost',
          shared: {
            react: {
              singleton: true,
            },
            'react-dom': {
              singleton: true,
            },
          },
        }),
      )
    }, */
    debug: {
      clearLog: false,
      showRsconfig: false,
    },
  }
})
