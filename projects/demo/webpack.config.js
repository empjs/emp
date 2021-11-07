module.exports = {
  mode: 'development',
  watch: false,
  watchOptions: {
    ignored: ['**/.git/**', '**/node_modules/**', '**/dist/**'],
  },
  cache: false,
  experiments: {
    topLevelAwait: true,
    buildHttp: {
      allowedUris: [],
    },
    backCompat: true,
  },
  plugins: [
    {},
    {
      _options: {
        filename: 'emp.js',
      },
    },
    {
      _options: {
        filename: 'emp.json',
      },
    },
    {
      userOptions: {
        title: 'EMP',
        template: '/Users/ken/Desktop/develop/emp/emp/packages/emp/template/public/index.html',
        favicon: '/Users/ken/Desktop/develop/emp/emp/packages/emp/template/public/favicon.ico',
        chunks: ['index'],
        files: {
          css: [],
          js: [],
        },
        minify: false,
      },
      version: 5,
    },
    {
      options: {
        exclude: {},
        include: {},
        overlay: {
          entry:
            '/Users/ken/Desktop/develop/emp/emp/node_modules/.pnpm/@pmmmwh+react-refresh-webpack-plugin@0.5.1_ebd583166f67a5a7a21a751669dc7bd5/node_modules/@pmmmwh/react-refresh-webpack-plugin/client/ErrorOverlayEntry.js',
          module:
            '/Users/ken/Desktop/develop/emp/emp/node_modules/.pnpm/@pmmmwh+react-refresh-webpack-plugin@0.5.1_ebd583166f67a5a7a21a751669dc7bd5/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js',
          sockIntegration: 'wds',
        },
      },
    },
  ],
  stats: {
    errorDetails: true,
  },
  devtool: 'inline-source-map',
  output: {
    clean: false,
    path: '/Users/ken/Desktop/develop/emp/emp/projects/demo/dist',
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
      src: '/Users/ken/Desktop/develop/emp/emp/projects/demo/src',
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
    modules: [
      '/Users/ken/Desktop/develop/emp/emp/projects/demo/node_modules',
      '/Users/ken/Desktop/develop/emp/emp/projects/demo/src',
      'node_modules',
    ],
  },
  devServer: {
    bonjour: true,
    port: 8001,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    static: [
      {
        directory: '/Users/ken/Desktop/develop/emp/emp/projects/demo/public',
        publicPath: '/',
      },
      {
        directory: '/Users/ken/Desktop/develop/emp/emp/projects/demo/dist',
        publicPath: '/',
        staticOptions: {},
      },
    ],
    client: {
      overlay: true,
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
            loader: '/Users/ken/Desktop/develop/emp/emp/packages/swc-loader/dist/index.js',
            options: {
              sourceMaps: true,
              jsc: {
                target: 'es5',
                externalHelpers: false,
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                    importSource: 'react',
                    refresh: true,
                    development: true,
                    useBuiltins: false,
                  },
                },
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
              '/Users/ken/Desktop/develop/emp/emp/node_modules/.pnpm/url-loader@4.1.1_webpack@5.62.1/node_modules/url-loader/dist/cjs.js',
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
    ],
  },
  optimization: {
    chunkIds: 'named',
    minimize: false,
  },
  entry: {
    index: ['/Users/ken/Desktop/develop/emp/emp/projects/demo/src/index.ts'],
  },
}
