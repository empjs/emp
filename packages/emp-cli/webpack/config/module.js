module.exports = (env, config, {hot}) => {
  const isDev = env === 'development'
  const conf = {
    module: {
      rule: {
        /* bootstrap: {
          test: /bootstrap\.(tsx|jsx)$/,
          loader: 'bundle-loader',
          options: {
            lazy: true,
          },
        }, */
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
          exclude: /node_modules/,
          use: {
            babel: {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    require('@babel/preset-env').default,
                    {
                      useBuiltIns: 'entry',
                      // debug: isDev,
                      debug: false,
                      corejs: 3,
                      bugfixes: true,
                      exclude: ['transform-typeof-symbol'],
                    },
                  ],
                  '@babel/preset-typescript',
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
                    require('@babel/plugin-transform-runtime').default,
                    {
                      corejs: false,
                      helpers: true,
                      version: require('@babel/runtime/package.json').version,
                      regenerator: true,
                      useESModules: false,
                      absoluteRuntime: false,
                    },
                  ],
                  [require('@babel/plugin-proposal-decorators').default, {legacy: true}],
                  [require('@babel/plugin-proposal-class-properties').default, {loose: true}],
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
