import type {GlobalStore} from '@empjs/cli'
//
export default () => {
  return {
    name: '@empjs/plugin-stylus',
    async rsConfig(store: GlobalStore) {
      const {chain} = store
      chain.module
        .rule('stylus')
        .test(/\.styl$/)
        .use('style-loader')
        .loader(require.resolve('style-loader'))
        .end()
        .use('css-loader')
        .loader(require.resolve('css-loader'))
        .end()
        .use('stylus-loader')
        .loader(require.resolve('stylus-loader'))
        .options({
          stylusOptions: {
            // use: ["nib"],
            // include: [path.join(__dirname, "src/styl/config")],
            // import: ["nib", path.join(__dirname, "src/styl/mixins")],
            // define: [
            // 	["$development", process.env.NODE_ENV === "development"],
            // 	["rawVar", 42, true],
            // ],
            includeCSS: false,
            resolveURL: true,
            lineNumbers: true,
            hoistAtrules: true,
            compress: true,
          },
        })
      //
    },
  }
}
