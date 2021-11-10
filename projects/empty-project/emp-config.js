const {defineConfig} = require('@efox/emp')
const pluginBabelReact = require('@efox/plugin-babel-react').default
module.exports = defineConfig({
  plugins: [pluginBabelReact],
})
