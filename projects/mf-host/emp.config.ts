import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {externalReact, pluginRspackEmpShare} from '@empjs/share'
// import getConfig from './emp.runtime'

export default defineConfig(store => {
  const ip = store.getLanIp()
  const port = 6001
  // const {empRuntime, polyfillCdn} = getConfig(ip, store)
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: 'mfHost',
        // dts: true,
        // shared: {
        //   react: {
        //     singleton: true,
        //     requiredVersion: '18',
        //   },
        //   'react-dom': {
        //     singleton: true,
        //     requiredVersion: '18',
        //   },
        // },
        // experiments: {
        //   asyncStartup: true,
        // },
        exposes: {
          './App': './src/App',
          './CountComp': './src/CountComp',
          './Section': './src/component/Section',
        },
        manifest: true,
        // dts: {
        //   generateTypes: true,
        // },
        // dev: {
        //   disableHotTypesReload: false,
        //   disableDynamicRemoteTypeHints: false,
        //   disableLiveReload: false,
        // },
        // dev: false,
        empRuntime: {
          framework: {
            global: 'EMP_ADAPTER_REACT',
            libs: [`https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js`],
          },
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.11.3/output/sdk.js`,
            // lib: `http://${ip}:2100/sdk.js`,
          },
          setExternals: externalReact,
        },
        // experiments: {
        //   federationRuntime: 'hoisted',
        // },
        // dataPrefetch: true,
      }),
    ],
    define: {ip, port},
    build: {
      polyfill: {
        mode: 'entry',
        entryCdn: 'https://unpkg.com/@empjs/polyfill@0.0.2/dist/es.js',
        browserslist: store.browserslistOptions.h5,
      },
      sourcemap: {
        js: store.isDev ? 'cheap-module-source-map' : 'source-map',
        css: true,
        /* devToolPluginOptions: {
          append: '\n//# sourceMappingURL=http://frontmon-sysop.bigoweb-test.bigo.inner/map/fed-activity/[url]',
          filename: '[file].map[query]',
        }, */
      },
    },
    html: {
      template: 'src/index.html',
      tags: [
        {tagName: 'link', attributes: {rel: 'dns-prefetch', href: 'https://unpkg.com'}},
        // {tagName: 'link', attributes: {rel: 'preconnect', href: 'https://unpkg.com'}},
        {innerHTML: 'console.log(123234)', tagName: 'script', pos: 'head'},
      ],
    },
    server: {
      port,
      open: false,
      hot: true,
      // client: {
      //   webSocketURL: `ws://${ip}:${port}/ws`,
      // },
    },
    debug: {
      // showRsconfig: 'log.json',
      clearLog: false,
    },
    chain(config) {
      config.module
        .rule('sass')
        .use('sassLoader')
        .tap((options: any) => {
          return {
            ...options,
            // additionalData: `@import '~@/css/mixin';`,
            additionalData: `@use '~@/css/mixin' as *;`,
          }
        })
    },
    // cache: true,
  }
})
