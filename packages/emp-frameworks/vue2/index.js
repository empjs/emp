const path = require('path')
module.exports = fn => ec => {
  const {config} = ec
  config.resolve.alias.set('vue', '@vue/runtime-dom')
  config.plugin('vue_v2').use(require('vue-loader').VueLoaderPlugin, [])
  config.module
    .rule('vue_v2')
    .test(/\.vue$/)
    .use('vue-loader')
    .loader('vue-loader')
  config.resolve.alias.set('vue$', 'vue/dist/vue.esm.js').clear()
  return fn(ec)
}
