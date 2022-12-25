import type {ConfigPluginOptions} from '@efox/emp'
/**
 * EMP vue3 babel Plugin
 * PluginBabelVue3
 * TODO
 * 支持SWC https://github.com/g-plane/swc-plugin-vue-jsx
 */
const PluginBabelVue3 = ({wpChain}: ConfigPluginOptions): void => {
  wpChain.resolve.alias.set('vue', '@vue/runtime-dom')
  wpChain.resolve.alias.set('vue$', 'vue/dist/vue.esm-bundler.js')
  //
  wpChain.module
    .rule('scripts')
    .use('babel')
    .tap(o => {
      const typescriptIndex = o.presets.findIndex((plugin: string) => {
        return plugin === require.resolve('@babel/preset-typescript')
      })
      o.presets[typescriptIndex] = [
        require.resolve('@babel/preset-typescript'),
        {
          isTSX: true, // allExtensions依赖isTSX  https://babeljs.io/docs/en/babel-preset-typescript#allextensions
          allExtensions: true, // 支持所有文件扩展名
        },
      ]

      o.plugins.push([require.resolve('@vue/babel-plugin-jsx'), {optimize: true}])
      return o
    })

  wpChain.module
    .rule('vue-loader')
    .test(/\.vue$/)
    .use('vue-loader')
    .loader(require.resolve('vue-loader'))

  wpChain.plugin('vue-loader-plugin').use(require('vue-loader').VueLoaderPlugin, [])

  const svgRule = wpChain.module.rule('svg')
  svgRule.uses.clear()
  svgRule
    .oneOf('component')
    .resourceQuery(/component/)
    .use('vue-loader')
    .loader(require.resolve('vue-loader'))
    .end()
    .use('vue-svg-loader')
    .loader(require.resolve('vue-svg-loader'))
    .end()
    .end()
    .oneOf('external')
    .set('type', 'asset/resource')
}

export default PluginBabelVue3
module.exports = PluginBabelVue3
