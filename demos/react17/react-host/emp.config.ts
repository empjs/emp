import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {pluginRspackEmpShare} from '@empjs/share'
export default defineConfig(store => {
  const ip = store.getLanIp()
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: 'mfHost',
        shared: {
          react: {
            singleton: true,
            requiredVersion: '17',
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '17',
          },
        },
        exposes: {
          './App': './src/App',
          './CountComp': './src/CountComp',
        },
        empRuntime: {
          runtimeLib: "https://unpkg.com/@empjs/share@3.1.2/output/full.js",
          frameworkLib: "https://unpkg.com/@empjs/libs-17@0.0.1/dist",
          frameworkGlobal: 'EMP_ADAPTER_REACT_17',
          framework: 'react',
        },
        // experiments: {
        //   federationRuntime: 'hoisted',
        // },
      }),
    ],
    build: {
      polyfill: 'entry',
      // polyfill: 'usage',
      browserslist: store.browserslistOptions.h5,
      swcConfig: {
        transform: {
          useDefineForClassFields: false,
        },
      },
    },
    html: {
      template: 'src/index.html',
    },
    server: {
      port: 6001,
      open: false,
    },
    debug: {
      // showRsconfig: true,
      // clearLog: false,
    },
    chain(config) {
      config.module
        .rule('sass')
        .use('sassLoader')
        .tap(options => {
          return {
            ...options,
            additionalData: `@import '~@/css/mixin';`,
          }
        })
    },
  }
})
