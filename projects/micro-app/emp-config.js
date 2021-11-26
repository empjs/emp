const {defineConfig} = require('@efox/emp')
const cdn = require('./cdn')
module.exports = defineConfig(({mode}) => {
  const target = 'es2018'
  // const target = 'es5'
  const isESM = !['es3', 'es5'].includes(target)
  return {
    build: {
      target,
    },
    server: {
      port: 8002,
    },
    empShare: {
      name: 'microApp',
      remotes: {
        '@microHost': `${isESM ? '' : 'microHost@'}http://172.29.181.115:8001/emp.js`,
      },
      exposes: {
        './App': './src/App',
      },
      shareLib: !isESM
        ? cdn(mode)
        : {
            react: 'https://cdn.skypack.dev/react',
            'react-dom': 'https://cdn.skypack.dev/react-dom',
            mobx: 'https://cdn.skypack.dev/mobx',
            'mobx-react-lite': 'https://cdn.skypack.dev/mobx-react-lite',
          },
    },
    html: {title: 'Micro-App'},
  }
})
