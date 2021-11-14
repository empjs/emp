const vue2 = require('@efox/plugin-vue-2')
const {defineConfig} = require('@efox/emp')

module.exports = defineConfig({
  plugins: [vue2],
  appEntry: 'main.js',
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
  },
  webpack() {
    return {
      devServer: {
        port: 9002,
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
})
