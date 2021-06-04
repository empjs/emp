/**
 * @type {import('@efox/emp-cli').EMPConfig}
 */
module.exports = {
  framework: [require('@efox/emp-vue2')],
  webpackChain(config) {
    config.plugin('html').tap(args => {
      args[0] = {
        ...args[0],
        ...{
          title: 'EMP Vue2 Base',
        },
      }
      return args
    })

    // 配置 svg loader
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule.use('vue-svg-loader').loader('vue-svg-loader')
  },
  webpack() {
    return {
      devServer: {
        port: 8009,
      },
    }
  },
  async moduleFederation() {
    return {
      name: 'vue2Base',
      filename: 'emp.js',
      exposes: {
        './Content': './src/components/Content',
      },
      // shared: ['vue/dist/vue.esm.js'],
    }
  },
}
