const {defineConfig} = require('@efox/emp')
const {cdn, esm} = require('./cdn')
const reactVersion = '17.0.2'
const esmVersion = 'es2018'
module.exports = defineConfig(({mode}) => {
  const target = esmVersion
  // const target = 'es5'
  const isESM = !['es3', 'es5'].includes(target)
  return {
    build: {
      target,
      staticDir: 'static',
      // createTs: true,
      /*
       设置类型文件夹 相应的远程 dtsPath 需要设置 如:
       '@microHost': 'http://127.0.0.1:8001/types/index.d.ts',
			 不包含 dist/ 目录
			*/
      // typesOutDir: 'dist',
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
        // './Button': './src/Button',
        './incStore': './src/store/incStore',
      },
      /*   shared: {
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
      // shareLib: cdn(mode),
    },
    html: {title: 'Micro-Host'},
  }
})
