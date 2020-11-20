const path = require('path')
module.exports = fn => ec => {
  const {config} = ec
  //
  config.resolve.alias.set('vue', '@vue/runtime-dom')
  //
  config.plugin('vue_v3').use(require('vue-loader').VueLoaderPlugin, [])
  //
  config.module
    .rule('vue_v3')
    .test(/\.vue$/)
    .use('vue-loader')
    .loader('vue-loader')
  // config.resolve.alias.set('vue$', 'vue/dist/vue.esm.js').clear()
  /*   config.module
    .rule('scripts')
    .use('babel')
    .tap(o => {
      o.presets = ['@vue/cli-plugin-babel/preset', '@vue/babel-preset-jsx', '@babel/preset-typescript']
      o.appendTsSuffixTo = [/\.vue$/]
      o.plugins = []
      // react
      // o.presets.push(require('@vue/cli-plugin-babel/preset').default)
      // o.presets.push(require('@vue/babel-preset-jsx').default)
      return o
    }) */
  //
  // config.resolve.set('symlinks', false)
  return fn(ec)
}
