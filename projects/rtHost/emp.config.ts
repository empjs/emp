import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
// import {ModuleFederationPlugin} from '@module-federation/rspack'
import {externalReact, pluginRspackEmpShare} from '@empjs/share'
export default defineConfig(store => {
  return {
    plugins: [
      pluginReact({
        // import: {
        //   src: `https://unpkg.com/@empjs/cdn-react@0.19.0/dist/reactRouter.${store.mode}.umd.js`,
        //   externals: {
        //     React: 'EMP_ADAPTER_REACT.react',
        //     ReactDOM: 'EMP_ADAPTER_REACT.react-dom',
        //   },
        // },
      }),
      pluginRspackEmpShare({
        name: 'rtHost',
        shared: {
          react: {
            singleton: true,
          },
          'react-dom': {
            singleton: true,
          },
        },
        empRuntime: {
          framework: {
            global: 'EMP_ADAPTER_REACT',
            libs: [`https://unpkg.com/@empjs/cdn-react@0.19.0/dist/reactRouter.${store.mode}.umd.js`],
          },
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.12.0/output/sdk.js`,
          },
          setExternals: externalReact,
        },
      }),
    ],
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
