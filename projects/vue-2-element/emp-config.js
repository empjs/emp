const {defineConfig, empStore} = require('@efox/emp')
const vue = require('@efox/plugin-vue-2')
console.log('empStore 处理全局方法', empStore)
module.exports = defineConfig({
  plugins: [vue],
  html: {title: 'EMP Vue2 element'},
  server: {port: 9003},
  appEntry: 'main.js',
  externals: [
    {module: 'vue', global: 'Vue', entry: 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js'},
    {module: 'element-ui', global: 'ELEMENT', entry: 'https://unpkg.com/element-ui/lib/index.js'},
    {entry: `https://unpkg.com/element-ui/lib/theme-chalk/index.css`, type: 'css'},
  ],
  async moduleFederation() {
    return {
      name: 'vue2Element',
      remotes: {
        '@base': 'vue2Base@http://localhost:9001/emp.js',
      },
    }
  },
})
