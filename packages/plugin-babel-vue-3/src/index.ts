import type {ConfigPluginOptions} from '@efox/emp'

const babelOptions = {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        useBuiltIns: 'entry',
        debug: false,
        corejs: 3,
        loose: true,
      },
    ],
    [
      require.resolve('@babel/preset-typescript'),
      {
        isTSX: true, // allExtensions依赖isTSX  https://babeljs.io/docs/en/babel-preset-typescript#allextensions
        allExtensions: true, // 支持所有文件扩展名
      },
    ],
  ],
  plugins: [
    [
      require.resolve('@babel/plugin-transform-runtime'),
      {
        corejs: false,
        helpers: true,
        version: require('@babel/runtime/package.json').version,
        regenerator: true,
        useESModules: false,
        // absoluteRuntime: true,
      },
    ],
    [require.resolve('@babel/plugin-proposal-decorators'), {legacy: true}],
    [require.resolve('@babel/plugin-proposal-class-properties'), {loose: true}],
    [require.resolve('@vue/babel-plugin-jsx'), {optimize: true}],
  ],
  overrides: [],
}

const PluginBabelVue3 = ({wpChain}: ConfigPluginOptions): void => {
  wpChain.resolve.alias.set('vue', '@vue/runtime-dom')
  wpChain.resolve.alias.set('vue$', 'vue/dist/vue.esm-bundler.js')
  wpChain.module.rule('scripts').uses.clear()

  wpChain.module.rule('scripts').use('babel-loader').loader(require.resolve('babel-loader')).options(babelOptions)

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
