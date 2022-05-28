const {defineConfig} = require('@efox/emp')
// const pluginBabelReact = require('@efox/plugin-babel-react')
module.exports = defineConfig({
  //   splitCss: false,
  // plugins: [pluginBabelReact],
  moduleTransform: {
    parser: 'swc',
    // antdTransformImport: false,
  },
  build: {
    // target: 'es2021',
  },
})
