const {defineConfig} = require('@efox/emp')
const vue = require('@efox/plugin-vue-2')
module.exports = defineConfig({
  plugins: [vue],
  html: {title: 'EMP Vue2 project'},
  server: {port: 9002},
  appEntry: 'main.js',
  externals: [{module: 'vue', global: 'Vue', entry: 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js'}],
  async moduleFederation() {
    return {
      name: 'vue2Project',
      remotes: {
        '@v2b': 'vue2Base@http://localhost:9001/emp.js',
      },
      // shared: ['vue/dist/vue.esm.js'],
    }
  },
})
