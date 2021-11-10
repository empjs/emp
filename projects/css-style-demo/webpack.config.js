module.exports = {
  experiments: {
    outputModule: false,
    topLevelAwait: true,
    backCompat: true,
  },
  stats: {
    colors: true,
    preset: 'minimal',
    moduleTrace: true,
    errorDetails: true,
  },
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    clean: false,
    path: '/Users/ken/Desktop/develop/Efox/emp-workspace/projects/css-style-demo/dist',
    publicPath: 'auto',
    filename: 'js/[name].[contenthash:8].js',
    assetModuleFilename: 'assets/[name].[contenthash:8][ext][query]',
    environment: {
      arrowFunction: false,
      bigIntLiteral: false,
      const: false,
      destructuring: false,
      forOf: false,
      dynamicImport: false,
      module: false,
    },
  },
  resolve: {
    alias: {
      src: '/Users/ken/Desktop/develop/Efox/emp-workspace/projects/css-style-demo/src',
    },
    extensions: [
      '.js',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.css',
      '.less',
      '.scss',
      '.sass',
      '.json',
      '.wasm',
      '.vue',
      '.svg',
      '.svga',
    ],
    modules: ['/Users/ken/Desktop/develop/Efox/emp-workspace/projects/css-style-demo/src', 'node_modules'],
  },
  devServer: {
    port: 8000,
    host: '0.0.0.0',
    open: false,
    hot: true,
    historyApiFallback: true,
    compress: true,
    static: '/Users/ken/Desktop/develop/Efox/emp-workspace/projects/css-style-demo/public',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
  module: {
    generator: {
      'asset/resource': {
        publicPath: '/',
      },
    },
    rules: [
      {
        test: {},
        use: [
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/babel-loader@8.2.3_@babel+core@7.16.0/node_modules/babel-loader/lib/index.js',
            options: {
              presets: [
                [
                  '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/@babel+preset-env@7.16.0_@babel+core@7.16.0/node_modules/@babel/preset-env/lib/index.js',
                ],
                [
                  '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/@babel+preset-typescript@7.16.0_@babel+core@7.16.0/node_modules/@babel/preset-typescript/lib/index.js',
                ],
                [
                  '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/@babel+preset-react@7.16.0_@babel+core@7.16.0/node_modules/@babel/preset-react/lib/index.js',
                  {
                    runtime: 'automatic',
                  },
                ],
              ],
            },
          },
          {
            loader: '@svgr/webpack',
            options: {
              babel: false,
            },
          },
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/url-loader@4.1.1_webpack@5.62.1/node_modules/url-loader/dist/cjs.js',
            options: {
              esModule: false,
            },
          },
        ],
      },
      {
        test: {},
        type: 'asset',
      },
      {
        test: {},
        type: 'asset/resource',
      },
      {
        test: {},
        type: 'asset/resource',
      },
      {
        test: {},
        exclude: [{}],
        use: [
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/style-loader@3.3.1_webpack@5.62.1/node_modules/style-loader/dist/cjs.js',
          },
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/css-loader@6.5.1_webpack@5.62.1/node_modules/css-loader/dist/cjs.js',
            options: {
              modules: false,
            },
          },
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/postcss-loader@6.2.0_webpack@5.62.1/node_modules/postcss-loader/dist/cjs.js',
            options: {
              postcssOptions: {
                hideNothingWarning: true,
              },
            },
          },
        ],
      },
      {
        test: {},
        use: [
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/style-loader@3.3.1_webpack@5.62.1/node_modules/style-loader/dist/cjs.js',
          },
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/css-loader@6.5.1_webpack@5.62.1/node_modules/css-loader/dist/cjs.js',
            options: {
              modules: {
                localIdentName: '[path][name]-[local]-[hash:base64:5]',
              },
            },
          },
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/postcss-loader@6.2.0_webpack@5.62.1/node_modules/postcss-loader/dist/cjs.js',
            options: {
              postcssOptions: {
                hideNothingWarning: true,
              },
            },
          },
        ],
      },
      {
        test: {},
        use: [
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/style-loader@3.3.1_webpack@5.62.1/node_modules/style-loader/dist/cjs.js',
          },
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/css-loader@6.5.1_webpack@5.62.1/node_modules/css-loader/dist/cjs.js',
            options: {
              modules: {
                localIdentName: '[path][name]-[local]-[hash:base64:5]',
              },
            },
          },
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/postcss-loader@6.2.0_webpack@5.62.1/node_modules/postcss-loader/dist/cjs.js',
            options: {
              postcssOptions: {
                hideNothingWarning: true,
              },
            },
          },
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/sass-loader@12.3.0_sass@1.43.4+webpack@5.62.1/node_modules/sass-loader/dist/cjs.js',
            options: {
              implementation: {
                info: 'dart-sass\t1.43.4\t(Sass Compiler)\t[Dart]\ndart2js\t2.14.4\t(Dart Compiler)\t[Dart]',
                types: {},
                NULL: {},
                TRUE: {
                  value: true,
                },
                FALSE: {
                  value: false,
                },
              },
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: {},
        exclude: [{}],
        use: [
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/style-loader@3.3.1_webpack@5.62.1/node_modules/style-loader/dist/cjs.js',
          },
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/css-loader@6.5.1_webpack@5.62.1/node_modules/css-loader/dist/cjs.js',
            options: {
              modules: false,
            },
          },
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/postcss-loader@6.2.0_webpack@5.62.1/node_modules/postcss-loader/dist/cjs.js',
            options: {
              postcssOptions: {
                hideNothingWarning: true,
              },
            },
          },
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/sass-loader@12.3.0_sass@1.43.4+webpack@5.62.1/node_modules/sass-loader/dist/cjs.js',
            options: {
              implementation: {
                info: 'dart-sass\t1.43.4\t(Sass Compiler)\t[Dart]\ndart2js\t2.14.4\t(Dart Compiler)\t[Dart]',
                types: {},
                NULL: {},
                TRUE: {
                  value: true,
                },
                FALSE: {
                  value: false,
                },
              },
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: {},
        exclude: [{}],
        use: [
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/style-loader@3.3.1_webpack@5.62.1/node_modules/style-loader/dist/cjs.js',
          },
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/css-loader@6.5.1_webpack@5.62.1/node_modules/css-loader/dist/cjs.js',
            options: {
              modules: false,
            },
          },
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/postcss-loader@6.2.0_webpack@5.62.1/node_modules/postcss-loader/dist/cjs.js',
            options: {
              postcssOptions: {
                hideNothingWarning: true,
              },
            },
          },
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/less-loader@10.2.0_webpack@5.62.1/node_modules/less-loader/dist/cjs.js',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: {},
        use: [
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/style-loader@3.3.1_webpack@5.62.1/node_modules/style-loader/dist/cjs.js',
          },
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/css-loader@6.5.1_webpack@5.62.1/node_modules/css-loader/dist/cjs.js',
            options: {
              modules: {
                localIdentName: '[path][name]-[local]-[hash:base64:5]',
              },
            },
          },
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/postcss-loader@6.2.0_webpack@5.62.1/node_modules/postcss-loader/dist/cjs.js',
            options: {
              postcssOptions: {
                hideNothingWarning: true,
              },
            },
          },
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/less-loader@10.2.0_webpack@5.62.1/node_modules/less-loader/dist/cjs.js',
          },
        ],
      },
      {
        test: {},
        exclude: [
          '/Users/ken/Desktop/develop/Efox/emp-workspace/projects/css-style-demo/node_modules',
          '/Users/ken/Desktop/develop/Efox/emp-workspace/projects/css-style-demo/bower_components',
        ],
        use: [
          {
            loader:
              '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/babel-loader@8.2.3_@babel+core@7.16.0/node_modules/babel-loader/lib/index.js',
            options: {
              presets: [
                [
                  '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/@babel+preset-env@7.16.0_@babel+core@7.16.0/node_modules/@babel/preset-env/lib/index.js',
                  {
                    useBuiltIns: 'entry',
                    debug: false,
                    corejs: 3,
                    exclude: ['transform-typeof-symbol'],
                    loose: true,
                  },
                ],
                '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/@babel+preset-typescript@7.16.0_@babel+core@7.16.0/node_modules/@babel/preset-typescript/lib/index.js',
                [
                  '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/@babel+preset-react@7.16.0_@babel+core@7.16.0/node_modules/@babel/preset-react/lib/index.js',
                  {
                    runtime: 'automatic',
                  },
                ],
              ],
              plugins: [
                '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/react-refresh@0.11.0/node_modules/react-refresh/babel.js',
                [null],
                [
                  '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/@babel+plugin-transform-runtime@7.16.0_@babel+core@7.16.0/node_modules/@babel/plugin-transform-runtime/lib/index.js',
                  {
                    corejs: false,
                    helpers: true,
                    version: '7.16.3',
                    regenerator: true,
                    useESModules: false,
                  },
                ],
                [
                  '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/@babel+plugin-proposal-decorators@7.16.0_@babel+core@7.16.0/node_modules/@babel/plugin-proposal-decorators/lib/index.js',
                  {
                    legacy: true,
                  },
                ],
                [
                  '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/@babel+plugin-proposal-class-properties@7.16.0_@babel+core@7.16.0/node_modules/@babel/plugin-proposal-class-properties/lib/index.js',
                  {
                    loose: true,
                  },
                ],
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    {
      definitions: {
        mode: 'development',
        'process.env.mode': 'development',
      },
    },
    {},
    {
      userOptions: {
        title: 'EMP',
        template: '/Users/ken/Desktop/develop/Efox/emp-workspace/packages/emp/template/index.html',
        chunks: ['index'],
        favicon: '/Users/ken/Desktop/develop/Efox/emp-workspace/packages/emp/template/favicon.ico',
        files: {
          css: [],
          js: [],
        },
        scriptLoading: 'defer',
        minify: false,
      },
      version: 5,
    },
    {
      profile: false,
      modulesCount: 5000,
      dependenciesCount: 10000,
      showEntries: true,
      showModules: true,
      showDependencies: true,
      showActiveModules: false,
    },
    {
      options: {
        exclude: {},
        include: {},
        overlay: {
          entry:
            '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/@pmmmwh+react-refresh-webpack-plugin@0.5.1_react-refresh@0.11.0/node_modules/@pmmmwh/react-refresh-webpack-plugin/client/ErrorOverlayEntry.js',
          module:
            '/Users/ken/Desktop/develop/Efox/emp-workspace/node_modules/.pnpm/@pmmmwh+react-refresh-webpack-plugin@0.5.1_react-refresh@0.11.0/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js',
          sockIntegration: 'wds',
        },
      },
    },
  ],
  entry: {
    index: ['/Users/ken/Desktop/develop/Efox/emp-workspace/projects/css-style-demo/src/index.ts'],
  },
}
