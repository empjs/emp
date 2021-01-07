const {resolveApp, getPaths, cachePaths} = require('../../helpers/paths')
//========== cache version control ===================
const {version} = require('../../package.json')
const childProcess = require('child_process')
let gitVersion = 'noGit'
try {
  gitVersion = childProcess.execSync('git rev-parse HEAD')
  gitVersion = gitVersion ? gitVersion.toString() : 'noGit'
} catch (e) {
  console.error(e)
}
//===================
module.exports = (env, config, args, {isRemoteConfig, remoteConfig}) => {
  const {entry, appSrc, dist} = getPaths()
  const isDev = env === 'development'
  const buildDependenciesConfigs = [__filename]
  if (isRemoteConfig) buildDependenciesConfigs.push(remoteConfig)
  const commonConfig = {
    cache: {
      version: `${version}-${gitVersion}${args.hot ? '-hot' : ''}`,
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
      minimize: !isDev,
      // minimizer: [],
    },
    entry: {index: entry},
    watchOptions: {
      ignored: ['**/.git/**', '**/node_modules/**'],
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
  }
  config.merge(commonConfig)
  //
  require('./style')(env, config)
  // require('./css')(env, config)
  require('./file')(env, config)
  require('./module')(env, config, args)
  require('./plugin')(env, config, args)
  require('./experiments')(env, config)
  // return conf
}
