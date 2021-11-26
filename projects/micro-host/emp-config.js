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
      port: 8001,
    },
    empShare: {
      name: 'microHost',
      // esm 共享需要设置 window
      // library: {name: 'microHost', type: 'window'},
      exposes: {
        './App': './src/App',
      },
      // shared: {
      //   react: {requiredVersion: '^17.0.1'},
      //   'react-dom': {requiredVersion: '^17.0.1'},
      // },
      shareLib: !isESM
        ? cdn(mode)
        : {
            react: 'https://cdn.skypack.dev/react',
            'react-dom': 'https://cdn.skypack.dev/react-dom',
            mobx: 'https://cdn.skypack.dev/mobx',
            'mobx-react-lite': 'https://cdn.skypack.dev/mobx-react-lite',
          },
      // shareLib: cdn(mode),
    },
    html: {title: 'Micro-Host'},
  }
})
