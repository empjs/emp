const {defineConfig} = require('@efox/emp')
const vue = require('@efox/plugin-vue-2')
const target = 'es2018'
const isESM = !['es3', 'es5'].includes(target)
module.exports = defineConfig({
  plugins: [vue],
  build: {target},
  html: {title: 'EMP Vue2 project'},
  server: {port: 9002},
  appEntry: 'main.js',
  empShare: {
    name: 'vue2Project',
    remotes: {
      '@v2b': 'vue2Base@http://localhost:9001/emp.js',
    },
    shared: ['vue/dist/vue.esm.js', 'element-ui'],
    // shareLib: !isESM
    //   ? {
    //       vue: 'Vue@https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js',
    //       'element-ui': [
    //         'ELEMENT@https://unpkg.com/element-ui/lib/index.js',
    //         `https://unpkg.com/element-ui/lib/theme-chalk/index.css`,
    //       ],
    //     }
    //   : {
    //       vue: esm('vue'),
    //       'element-ui': esm('element-ui'),
    //     },
  },
  /*
  async moduleFederation() {
    return {
      name: 'vue2Project',
      remotes: {
        '@v2b': 'vue2Base@http://localhost:9001/emp.js',
      },
      shared: ['vue/dist/vue.esm.js'],
    }
  },
	*/
})
