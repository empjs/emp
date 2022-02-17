const {defineConfig} = require('@efox/emp')
const vue = require('@efox/plugin-vue-2')
module.exports = defineConfig({
  plugins: [vue],
  html: {title: 'EMP Vue2 project'},
  server: {port: 9002},
  appEntry: 'main.js',
  async moduleFederation() {
    return {
      name: 'vue2Project',
      remotes: {
        '@v2b': 'vue2Base@http://localhost:9001/emp.js',
      },
      shared: ['vue/dist/vue.esm.js', '@vue/composition-api'],
    }
  },
})
