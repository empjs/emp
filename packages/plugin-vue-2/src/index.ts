import type {ConfigPluginOptions} from '@efox/emp'

const PluginVue2 = async ({wpChain, config}: ConfigPluginOptions) => {
  // wpChain.resolve.alias.set('vue', '@vue/runtime-dom')
  wpChain.plugin('vue-loader-plugin').use(require('vue-loader').VueLoaderPlugin, [])
  wpChain.module
    .rule('vue-loader')
    .test(/\.vue$/)
    .use('vue-loader')
    .loader(require.resolve('vue-loader'))
    .end()
    .use('vue-svg-inline-loader')
    .loader(require.resolve('vue-svg-inline-loader'))
  // wpChain.resolve.alias.set('vue$', 'vue/dist/vue.esm.js').clear()
  // swc 暂时不支持 jsx
  if (config.compile.compileType === 'babel') {
    wpChain.module
      .rule('scripts')
      .use('babel')
      .tap(o => {
        const config = {
          presets: [o.presets[0], [require('@vue/babel-preset-jsx'), {compositionAPI: true}]],
          plugins: [o.plugins[0], o.plugins[1]], //部分插件引起报错
        }
        // console.log(o, 'config', config)
        return config
      })
  }
  // wpChain.module.rules.delete('svg')
  // svg rules
  const svgRule = wpChain.module.rule('svg')
  svgRule.uses.clear()
  svgRule
    // .test(/\.(svg)(\?.*)?$/)
    // .use('vue-loader')
    // .loader(require.resolve('vue-loader'))
    // .end()
    .use('vue-svg-loader')
    .loader(require.resolve('vue-svg-loader'))

  // wpChain.module.rule('image').test(/\.(png|jpe?g|gif|webp|ico|svg)$/i)
}

export default PluginVue2
module.exports = PluginVue2
