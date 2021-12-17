const {defineConfig} = require('@efox/emp')
const {cdn, esm} = require('./cdn')
module.exports = defineConfig(({mode, env}) => {
  console.log('mode env', mode, env)
  // const target = 'es2018'
  const target = 'es5'
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
        '@microHost': `microHost@http://127.0.0.1:8001/emp.js`,
      },
      exposes: {
        './App': './src/App',
      },
      shareLib: !isESM
        ? cdn(mode)
        : {
            react: esm('react', mode, '17.0.2'),
            'react-dom': esm('react-dom', mode, '17.0.2'),
            mobx: esm('mobx', mode),
            'mobx-react-lite': esm('mobx-react-lite', mode),
          },
    },
    html: {title: 'Micro-App'},
  }
})
