import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
// import {ModuleFederationPlugin} from '@module-federation/rspack'
import {externalReact, pluginRspackEmpShare} from '@empjs/share'
export default defineConfig(store => {
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: 'rtProvider',
        manifest: true,
        exposes: {
          './App': './src/App',
        },
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
      port: 4001,
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
