const {VueLoaderPlugin} = require('vue-loader')
const path = require('path')

module.exports = fn => ec => {
  const {config} = ec
  const entryPath = path.join(process.cwd(), 'src', 'main.js')
  config.entry('index').clear().add(entryPath)
  config.resolve.alias.set('vue', '@vue/runtime-dom')
  config.plugin('vue').use(VueLoaderPlugin, [])
  config.module
    .rule('vue')
    .test(/\.vue$/)
    .use('vue-loader')
    .loader('vue-loader')
  config.resolve.alias.set('vue$', 'vue/dist/vue.esm.js').clear()
  return fn(ec)
}
