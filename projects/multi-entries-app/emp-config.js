const {defineConfig} = require('@efox/emp')
const cdn = require('./cdn')
module.exports = defineConfig(({mode}) => {
  return {
    server: {
      port: 8000,
      https: true,
    },
    html: {favicon: 'src/favicon.ico'},
    entries: {
      'index.ts': {title: '首页'},
      'work/index.ts': {title: '作品', template: 'src/work/index.html'},
      'info.tsx': {title: '介绍'},
      'pc/index.tsx': {title: 'PC介绍', chunk: 'info-pc'},
    },
    empShare: {
      name: 'microApp',
      remotes: {
        '@microHost': 'microHost@http://localhost:8001/emp.js',
      },
      exposes: {
        './App': './src/App',
      },
      shareLib: cdn(mode),
    },
  }
})
