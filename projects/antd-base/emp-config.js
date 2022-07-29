const {defineConfig} = require('@efox/emp')
// const compile = require('@efox/emp-compile-esbuild')
module.exports = defineConfig({
  //   splitCss: false,
  // plugins: [pluginBabelReact],
  // compile,
  moduleTransform: {
    // antdTransformImport: false,
  },
  build: {
    minify: 'swc',
    // target: 'es2021',
  },
})
