const vue2 = require('@efox/plugin-vue-2')
const {defineConfig} = require('@efox/emp')
const esm = (name, mode, version) =>
  `https://esm.sh/${name}${version ? '@' + version : ''}${mode === 'development' ? '?dev' : ''}`
module.exports = defineConfig(({mode, env}) => {
  // const target = 'es2018'
  const target = 'es5'
  const isESM = !['es3', 'es5'].includes(target)
  return {
    plugins: [vue2],
    appEntry: 'main.js',
    server: {port: 9001},
    html: {title: 'EMP Vue2 Base'},
    build: {target},
    empShare: {
      name: 'vue2Base',
      exposes: {
        './Content': './src/components/Content',
        './Table': './src/components/table',
        './CompositionApi': './src/components/CompositionApi',
      },
      shareLib: !isESM
        ? {
            vue: 'Vue@https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js',
            'element-ui': [
              'ELEMENT@https://unpkg.com/element-ui/lib/index.js',
              `https://unpkg.com/element-ui/lib/theme-chalk/index.css`,
            ],
          }
        : {
            vue: esm('vue'),
            'element-ui': esm('element-ui'),
          },
    },
  }
})
