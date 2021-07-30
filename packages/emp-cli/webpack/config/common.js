const {resolveApp, getPaths, cachePaths} = require('../../helpers/paths')
//========== cache version control ===================
const {version} = require('../../package.json')
const {cmdSync} = require('../../helpers/cli')
const {measure} = require('../../helpers/debug')
// git rev-parse HEAD 提交版本 hash
// git rev-parse --abbrev-ref HEAD 分支名称
const gitVersion = cmdSync('git rev-parse --abbrev-ref HEAD') || 'noGit'
// console.log('gitVersion', gitVersion)
//===================
module.exports = (env, config, args, empConfigPath) => {
  const {entry, appSrc, dist} = getPaths()
  const isDev = env === 'development'
  const buildDependenciesConfigs = [__filename]
  if (empConfigPath) buildDependenciesConfigs.push(empConfigPath)
  // console.log('watch', !!args.watch, 'minify', args.minify)
  const commonConfig = {
    watch: !!args.watch,
    /* watchOptions: {
      ignored: /node_modules/,
    }, */
    // profile: true,
    cache: {
      version: `${version}-${gitVersion}${args.hot ? '-hot' : ''}${args.empEnv ? '-' + args.empEnv : ''}`,
      type: 'filesystem',
      cacheDirectory: cachePaths.webpack, //默认路径是 node_modules/.cache/webpack
      // 缓存依赖，当缓存依赖修改时，缓存失效
      buildDependencies: {
        // 将你的配置添加依赖，更改配置时，使得缓存失效
        config: buildDependenciesConfigs,
      },
    },
    // cache: false,
    optimization: {
      chunkIds: 'named',
      // runtimeChunk: true,//启动后不支持 Module Federation
      minimize: !isDev && args.minify === true,
      // minimizer: [],
    },
    entry: {index: entry},
    watchOptions: {
      ignored: ['**/.git/**', '**/node_modules/**', '**/dist/**'],
    },
    output: {
      path: dist,
      filename: 'static/js/[name].[contenthash:8].js',
      // [query] is now a valid placeholder when for paths based on a filename like assets
      assetModuleFilename: 'static/asset/[name].[contenthash:8][ext][query]',
      // 文件命名模版
      publicPath: 'auto',
      // 支持 es5 输出
      // ecmaVersion: 5,
      // output.ecmaVersion is replaced with output.environment which lists features used by webpack
      environment: {
        arrowFunction: false,
        bigIntLiteral: false,
        const: false,
        destructuring: false,
        forOf: false,
        dynamicImport: false,
        module: false,
      },
      // experiments.outputModule 为 true.
      // module: true,
      // libraryTarget: 'module',

      // https://github.com/webpack/webpack/issues/11660
      // chunkLoading: false,
      // wasmLoading: false,
    },
    resolve: {
      modules: [
        // 模块的查找目录
        'node_modules',
        resolveApp('node_modules'),
        appSrc,
      ],
      alias: {
        src: appSrc,
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
    },
    // 为 info 时， webpack-dev-server 才会输出进度信息
    infrastructureLogging: {
      level: args.progress ? 'info' : 'warn',
    },
    // 精简 webpack 编译输出信息
    stats: 'errors-warnings',
  }
  config.merge(commonConfig)
  //

  measure('commonConfig-style', () => require('./style')(env, config, args))
  // require('./css')(env, config)
  measure('commonConfig-file', () => require('./file')(env, config))

  measure('commonConfig-module', () => require('./module')(env, config, args))

  measure('commonConfig-plugin', () => require('./plugin')(env, config, args))

  measure('commonConfig-experiments', () => require('./experiments')(env, config))

  // return conf
}
