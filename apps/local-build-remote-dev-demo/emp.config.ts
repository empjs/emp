import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {externalReact, pluginRspackEmpShare} from '@empjs/share'

export default defineConfig(store => {
  console.log('demo:remote', store.cliOptions.env)
  const ip = store.server.ip
  const port = store.cliOptions.env === 'remote' ? 7001 : 7000
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: 'localbuildremotedevdemo',
        exposes: {
          './RemoteApp': './src/RemoteApp',
        },
        manifest: true,
        // dev: false,
        empRuntime: {
          framework: {
            global: 'EMP_ADAPTER_REACT',
            // libs: [`https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js`],
            libs: [`https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.development.umd.js`],
          },
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.6.0-beta.1/output/sdk.js`,
          },
          setExternals: externalReact,
        },
      }),
    ],
    define: {ip, port, remote: store.cliOptions.env === 'remote' ? true : false},
    build: {
      polyfill: {
        mode: 'entry',
        entryCdn: 'https://unpkg.com/@empjs/polyfill@0.0.2/dist/es.js',
        browserslist: store.browserslistOptions.h5,
      },
      sourcemap: true,
    },
    html: {
      template: 'src/index.html',
      tags: [{tagName: 'link', attributes: {rel: 'dns-prefetch', href: 'https://unpkg.com'}}],
    },
    server: {
      port,
      open: false,
      // liveReload: false,
      // hot: true,
    },
    debug: {
      // showRsconfig: true,
      clearLog: false,
    },
    // cache: false,
  }
})
