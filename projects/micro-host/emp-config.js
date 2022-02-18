const {defineConfig} = require('@efox/emp')
const {cdn, esm} = require('./cdn')

module.exports = defineConfig(({mode}) => {
  const target = 'es2018'
  // const target = 'es5'
  const isESM = !['es3', 'es5'].includes(target)
  return {
    build: {
      target,
      staticDir: 'static',
      createTs: true,
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
        './importExport/incStore': './src/store/incStore',
      },
      // shared: {
      //   react: {requiredVersion: '^17.0.1'},
      //   'react-dom': {requiredVersion: '^17.0.1'},
      // },
      shareLib: !isESM
        ? cdn(mode)
        : {
            react: esm('react', mode, '17.0.2'),
            'react-dom': esm('react-dom', mode, '17.0.2'),
            mobx: esm('mobx', mode),
            'mobx-react-lite': esm('mobx-react-lite', mode),
          },
      // shareLib: cdn(mode),
    },
    html: {title: 'Micro-Host'},
  }
})
