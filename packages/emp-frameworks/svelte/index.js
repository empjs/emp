const path = require('path')

module.exports = fn => ec => {
  const {config} = ec
  config.module
    .rule('svelte')
    .test(/\.svelte$/)
    .use('svelte-loader')
    .loader('svelte-loader')
  return fn(ec)
}
