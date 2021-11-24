const {defineConfig} = require('@efox/emp')
const cdn = require('./cdn')
module.exports = defineConfig(({mode}) => {
  return {
    server: {
      port: 8000,
    },
    html: {},
    entries: {
      'index.ts': {title: '首页'},
      'work/index.tsx': {title: '作品', template: 'src/work/index.html' /* favicon: 'src/work/favicon.ico' */},
      'info.tsx': {title: '介绍'},
    },
    empShare: {
      name: 'microApp',
      /* remotes: {
        '@microHost': 'microHost@http://localhost:8001/emp.js',
      }, */
      exposes: {
        './App': './src/App',
      },
      shareLib: cdn(mode),
    },
  }
})
