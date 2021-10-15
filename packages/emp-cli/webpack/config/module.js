module.exports = (env, config, {hot}) => {
  const isDev = env === 'development'
  const conf = {
    module: {
      // webpack 5.28.+
      generator: {
        'asset/resource': {
          publicPath: '/',
        },
      },
      rule: {
        // 解决 mjs 加载失败问题
        mjs: {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
        //
        scripts: {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            babel: {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [
                  [
                    require.resolve('@babel/preset-env'),
                    {
                      useBuiltIns: 'entry',
                      // debug: isDev,
                      debug: false,
                      corejs: 3,
                      // bugfixes: true,
                      exclude: ['transform-typeof-symbol'],
                      loose: true,
                    },
                  ],
                  require.resolve('@babel/preset-typescript'),
                  // '@babel/preset-react',
                ].filter(Boolean),
                plugins: [
                  //=========================== 只在 tsx 里面 触发 svg 不适用内置 babel
                  // [
                  //   require.resolve('babel-plugin-named-asset-import'),
                  //   {
                  //     loaderMap: {
                  //       svg: {
                  //         ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                  //       },
                  //     },
                  //   },
                  // ],
                  // //===================================================
                  // ['import', {libraryName: 'antd', style: true}],
                  // isDev && hot && require.resolve('react-refresh/babel'),
                  //
                  // [require('@babel/plugin-syntax-top-level-await').default],//观察是否支持 toplvawait 的 es5支持
                  [
                    require.resolve('@babel/plugin-transform-runtime'),
                    {
                      corejs: false,
                      helpers: true,
                      version: require('@babel/runtime/package.json').version,
                      regenerator: true,
                      useESModules: false,
                      absoluteRuntime: true,
                    },
                  ],
                  [require.resolve('@babel/plugin-proposal-decorators'), {legacy: true}],
                  [require.resolve('@babel/plugin-proposal-class-properties'), {loose: true}],
                ].filter(Boolean),
              },
            },
          },
        },
      },
    },
  }
  config.merge(conf)
}
