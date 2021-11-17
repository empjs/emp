// const path = require('path')
module.exports = fn => ec => {
  const {config, env} = ec
  // 变量声明
  const isDev = env === 'development'
  // 清除所有 关于 js jsx ts tsx的配置
  config.module.rules.store.delete('scripts')
  // 配置 .vue
  config.module
    .rule('vue-loader')
    .test(/\.vue$/)
    .use('vue-loader')
    .loader(require.resolve('vue-loader'))
  // 配置 .j|tsx?
  config.module
    .rule('babel-loader')
    .test(/\.(js|jsx|ts|tsx)$/)
    .exclude.add(/node_modules/)
    .end()
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options({
      presets: [
        [
          // 浏览器兼容性
          require.resolve('@babel/preset-env'),
          {
            useBuiltIns: 'entry',
            debug: false,
            corejs: 3,
            loose: true,
          },
        ],
        [
          // 支持 ts
          require.resolve('@babel/preset-typescript'),
          {
            isTSX: true, // allExtensions依赖isTSX  https://babeljs.io/docs/en/babel-preset-typescript#allextensions
            allExtensions: true, // 支持所有文件扩展名
          },
        ],
      ],
      plugins: [
        [
          // 自动 polyfill
          require.resolve('@babel/plugin-transform-runtime'),
          {
            corejs: false,
            helpers: true,
            version: require('@babel/runtime/package.json').version,
            regenerator: true,
            useESModules: false,
            absoluteRuntime: true,
          },
        ],
        // ts特性拓展
        [require.resolve('@babel/plugin-proposal-decorators'), {legacy: true}],
        [require.resolve('@babel/plugin-proposal-class-properties'), {loose: true}],
        [require.resolve('@vue/babel-plugin-jsx'), {optimize: true, isCustomElement: tag => /^x-/.test(tag)}],
      ],
      overrides: [],
    })
  // alias vue
  // config.resolve.alias.set('vue', '@vue/runtime-dom')
  // plugin
  config.plugin('vue-loader-plugin').use(require('vue-loader').VueLoaderPlugin, [])
  return fn && fn(ec)
}
