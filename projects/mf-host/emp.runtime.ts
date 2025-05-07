export default (ip, store): any => {
  return {
    empRuntime: {
      framework: {
        global: 'EMP_ADAPTER_REACT',
        libs: [`https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js`],
      },
      runtime: {
        // lib: `https://unpkg.com/@empjs/share@3.6.0-beta.1/output/sdk.js`,
        lib: `http://${ip}:2100/sdk.js`,
      },
    },
    polyfillCdn: `https://unpkg.com/@empjs/polyfill@0.0.2/dist/es.js`,
  }
}
