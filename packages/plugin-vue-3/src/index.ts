import type {ConfigPluginOptions} from '@efox/emp'

const PluginVue3 = async ({wpChain}: ConfigPluginOptions) => {
  wpChain.resolve.alias.set('vue', '@vue/runtime-dom')
  wpChain.plugin('vue-loader-plugin').use(require('vue-loader').VueLoaderPlugin, [])
  wpChain.module
    .rule('vue-loader')
    .test(/\.vue$/)
    .use('vue-loader')
    .loader(require.resolve('vue-loader'))
  // wpChain.resolve.alias.set('vue$', 'vue/dist/vue.esm.js').clear()
  //
  const svgRule = wpChain.module.rule('svg')
  svgRule.uses.clear()
  svgRule.use('vue-svg-loader').loader(require.resolve('vue-svg-loader'))
}

export default PluginVue3
module.exports = PluginVue3
