import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import pluginRspackEmpShare from '@empjs/share/rspack'
export default defineConfig(store => {
  const ip = store.getLanIp()
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: store.uniqueName,
        shared: {
          react: {
            singleton: true,
            requiredVersion: '18',
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '18',
          },
        },
        remotes: {
          mfHost: `mfHost@http://${ip}:6001/emp.js`,
        },
        empRuntime: {
          runtimeLib: "https://unpkg.yy.com/@empjs/share@3.1.2/output/full.js",
          frameworkLib: "https://unpkg.yy.com/@empjs/libs-18@0.0.1/dist",
          frameworkGlobal: 'EMP_ADAPTER_REACT',
          framework: 'react',
        },
        // experiments: {
        //   federationRuntime: 'hoisted',
        // },
      }),
    ],
    build: {
      // polyfill: false,
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
      port: 6002,
      open: false,
    },
    debug: {
      // showRsconfig: true,
    },
  }
})
