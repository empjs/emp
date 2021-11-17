const vue2 = require('@efox/plugin-vue-2')
const {defineConfig} = require('@efox/emp')

module.exports = defineConfig({
  plugins: [vue2],
  appEntry: 'main.js',
  server: {port: 9001},
  html: {title: 'EMP Vue2 Base'},
  /* externals: [
    {module: 'vue', global: 'Vue', entry: 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js'},
    {module: 'element-ui', global: 'ELEMENT', entry: 'https://unpkg.com/element-ui/lib/index.js'},
    {entry: `https://unpkg.com/element-ui/lib/theme-chalk/index.css`, type: 'css'},
  ],
  async moduleFederation(c) {
    return {
      name: 'vue2Base',
      exposes: {
        './Content': './src/components/Content',
        './Table': './src/components/table',
      },
      // shared: ['vue/dist/vue.esm.js'],
    }
  }, */
  empShare: {
    name: 'vue2Base',
    exposes: {
      './Content': './src/components/Content',
      './Table': './src/components/table',
    },
    shareLib: {
      vue: 'Vue@https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js',
      'element-ui': [
        'ELEMENT@https://unpkg.com/element-ui/lib/index.js', 
        `https://unpkg.com/element-ui/lib/theme-chalk/index.css`,
      ],
    }
  }
})
