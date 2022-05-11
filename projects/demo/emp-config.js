const {defineConfig} = require('@efox/emp')
const {cdn, esm} = require('./cdn')

module.exports = defineConfig(config => {
  const {mode, env} = config
  // const target = 'es2018'
  const target = 'es5'
  const isESM = !['es3', 'es5'].includes(target)
  return {
    define: {emp: {name: 'empName', value: ['a', 'b', 'c']}},
    // base: '/',
    html: {title: 'Demo | EMP v2'},
    server: {
      port: 8000,
      // hot: 'only',
      // https: true,
    },
    // useExternalsReplaceScript: false,
    moduleTransform: {
      parser: 'swc',
    },
    build: {
      target,
      sourcemap: false,
      // outDir: 'build',
      minify: 'swc',
      minOptions: {
        compress: {
          // warnings: false,
          // drop_console: true,
          // drop_debugger: true,
          // pure_funcs: ['console.log'],
          // unused: true,
        },
        // mangle: true,
      },
    },
    // jsCheck: true,
    reactRuntime: 'automatic', //增加这个实现无安装依赖热更
    empShare: {
      shareLib: !isESM
        ? cdn(mode)
        : {
            react: esm('react', mode, '18.1.0'),
            'react-dom': esm('react-dom', mode, '18.1.0'),
            mobx: esm('mobx', mode, null, `react@18.1.0`),
            'mobx-react-lite': esm('mobx-react-lite', mode, null, `react@18.1.0`),
            'react-router-dom': esm('react-router-dom', '', '5', `react@18.1.0`),
          },
    },
    html: {
      favicon: 'src/favicon.ico',
    },
    debug: {
      clearLog: false,
      // level: 'debug',
    },
  }
})
