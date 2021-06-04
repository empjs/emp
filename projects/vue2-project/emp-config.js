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
          title: 'EMP Vue2 Project',
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
        port: 8008,
      },
    }
  },
  async moduleFederation() {
    return {
      name: 'vue2Project',
      filename: 'emp.js',
      remotes: {
        '@v2b': 'vue2Base@http://localhost:8009/emp.js',
      },
      // shared: ['vue/dist/vue.esm.js'],
    }
  },
}
