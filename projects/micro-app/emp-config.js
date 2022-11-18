const {defineConfig} = require('@efox/emp')
const {cdn, esm} = require('./cdn')
const reactVersion = '17.0.2'
const esmVersion = 'es2018'
module.exports = defineConfig(({mode, env}) => {
  // console.log('mode env', mode, env)
  const target = esmVersion
  // const target = 'es5'
  const isESM = !['es3', 'es5'].includes(target)
  return {
    build: {
      target,
    },
    server: {
      port: 8002,
    },

    // dtsPath: {
    //   '@microHost': 'http://127.0.0.1:8001/types/index.d.ts',
    // },
    empShare: {
      name: 'microApp',
      remotes: {
        '@microHost': `microHost@http://localhost:8001/emp.js`,
        // '@microHostaaa': `microHost@http://localhost:8001/emp.js`,
        // '@microHostB': `microHost@http://localhost:/emp.js`,
        // '@microHostCCC': `microHost@http://localhost:8001/emp.js`,
      },
      exposes: {
        './App': './src/App',
      },
      /* shared: {
        react: {requiredVersion: '^17.0.1'},
        'react-dom': {requiredVersion: '^17.0.1'},
        mobx: {requiredVersion: '^6'},
        'mobx-react': {requiredVersion: '^7'},
      }, */
      shareLib: !isESM
        ? cdn(mode)
        : {
            react: esm('react', mode, reactVersion, esmVersion),
            'react-dom': esm('react-dom', mode, reactVersion, esmVersion),
            zustand: esm('zustand', mode, '4', esmVersion, `react@${reactVersion},react-dom@${reactVersion}`),
          },
    },
    html: {title: 'Micro-App'},
    createTs: true,
  }
})
