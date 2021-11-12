const mf = require('./empconfig/mf')

/**
 * @type {import('@efox/emp-cli').EMPConfig}
 */
module.exports = {
  /**
   * 生成css
   * @default true
   */
  // splitCss: false,
  /**
   * 共享基站 不引用可以不需要 externals
   * 同时引用 其他基站需要 external
   */
  externals(config) {
    return [
      {
        module: 'react',
        global: 'React',
        entry:
          config.mode === 'development'
            ? `https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.development.js`
            : `https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.production.min.js`,
      },
      {
        module: 'react-dom',
        global: 'ReactDOM',
        entry:
          config.mode === 'development'
            ? 'https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.development.js'
            : 'https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.production.min.js',
      },
    ]
  },
  webpack({webpackEnv}) {
    console.log('webpack', webpackEnv)
    return {
      devServer: {
        port: 8001,
      },
    }
  },
  moduleGenerator({webpackEnv}) {
    console.log('moduleGenerator', webpackEnv)
    return webpackEnv === 'development' ? '/' : `http://localhost:8001/`
  },
  /* async moduleFederation({webpackEnv}) {
    return mf(webpackEnv)
  }, */
  moduleFederation: {
    name: 'demo1',
    filename: 'emp.js',
    remotes: {
      '@emp/demo2': 'demo2@http://localhost:8002/emp.js',
    },
    exposes: {
      './configs/index': './src/configs/index',
      './components/Demo': './src/components/Demo',
      './components/Hello': './src/components/Hello',
    },
    /* shared: {
      react: {singleton: true, requiredVersion: false},
      'react-dom': {singleton: true, requiredVersion: false},
    }, */
    /* shared: {
      react: {requiredVersion: '^17.0.1'},
      'react-dom': {requiredVersion: '^17.0.1'},
    }, */
    // shared: Object.assign({}, shareByVersion('react'), shareByVersion('react-dom')),
  },
  // isRegisterCommand: true,
}
