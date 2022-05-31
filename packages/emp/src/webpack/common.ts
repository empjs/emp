import path from 'path'
import fs from 'fs'
import logger from 'src/helper/logger'
import store from 'src/helper/store'
import wpChain from 'src/helper/wpChain'
import {Configuration} from 'webpack'
class WPCommon {
  isDev = true
  constructor() {}
  async setup() {
    this.isDev = store.config.mode === 'development'
    const {cache, resolve, experiments, output, stats, externals, target, snapshot} = this
    // init config
    const config: Configuration = {
      // cache: false,
      cache,
      // snapshot, //评估是否有效再加入到配置
      resolve,
      externals,
      target,
      experiments,
      output,
      stats,
    }
    // ESM
    this.setESM(config)
    // Merge
    wpChain.merge(config)
  }
  setESM(config: Configuration) {
    if (store.isESM) {
      config.externalsType = 'module'
    } else if (store.config.useExternalsReplaceScript) {
      config.externalsType = 'script'
    }
  }
  get target(): Configuration['target'] {
    return store.config.build.wpTarget ? store.config.build.wpTarget : ['web', store.config.build.target]
  }
  get externals(): Configuration['externals'] {
    return store.empShare.externals
  }
  get snapshot(): Configuration['snapshot'] {
    const conf = {
      // 由包管理器管理的路径数组，可以信任它不会被修改。
      managedPaths: [path.resolve(store.root, 'node_modules')],
      // 由包管理器管理的路径数组，在其路径中包含一个版本或哈希，以便所有文件都是不可变的
      immutablePaths: [],
      // 对于 buildDependencies snapshot 的创建方式
      buildDependencies: {
        // hash: true
        timestamp: true,
      },
      // 针对 module build 创建 snapshot 的方式
      module: {
        // hash: true
        timestamp: true,
      },
      // 在 resolve request 的时候创建 snapshot 的方式
      resolve: {
        // hash: true
        timestamp: true,
      },
      // 在 resolve buildDependencies 的时候创建 snapshot 的方式
      resolveBuildDependencies: {
        // hash: true
        timestamp: true,
      },
    }
    // console.log(conf)
    return conf
  }
  get cache(): Configuration['cache'] {
    const watchConfig = [__filename]
    const empConfig = store.resolve('emp-config.js')
    if (fs.existsSync(empConfig)) {
      watchConfig.push(empConfig)
    }
    const cacheName = `${store.pkg.name || 'emp'}-${store.config.mode}-${store.config.env || 'local'}-${
      store.pkg.version
    }`
    // console.log('cacheName', cacheName, store.empPkg.version)
    return {
      name: cacheName,
      type: 'filesystem',
      version: store.empPkg.version,
      profile: true, //暂时保留
      cacheDirectory: store.cacheDir,
      buildDependencies: {
        config: watchConfig,
      },
    }
    // return false
  }
  get experiments(): Configuration['experiments'] {
    return {
      outputModule: store.isESM,
      topLevelAwait: true,
      // buildHttp: {allowedUris: []},//影响热更
      backCompat: true,
    }
  }
  get output(): Configuration['output'] {
    const environment = !store.isESM
      ? {
          arrowFunction: false,
          bigIntLiteral: false,
          const: false,
          destructuring: false,
          forOf: false,
          dynamicImport: false,
          module: false,
        }
      : {
          // module: true,
          // dynamicImport: true,
        }
    const publicPath = store.config.base || ''
    const staticDir = store.config.build.staticDir ? `${store.config.build.staticDir}/` : ''
    //
    return {
      //TODO: Library 模式的处理
      // module: true,
      // iife: false,
      // scriptType: 'module',
      // module: true,
      // libraryTarget: 'module',
      // library: {
      //   // name: 'index',
      //   // type: 'module',
      //   // type: 'umd',
      // },
      // clean: store.config.build.emptyOutDir && !this.isDev, //替代 clean-webpack-plugin
      clean: store.config.build.emptyOutDir
        ? {
            keep(asset: string) {
              const typesOutDir = store.config.build.typesOutDir.replace(`${store.config.build.outDir}/`, '')
              // logger.debug('typesOutDir', typesOutDir, 'store.config.build.emptyOutDir', store.config.build.emptyOutDir)
              return asset.includes(typesOutDir)
            },
          }
        : false,
      path: store.outDir,
      publicPath: store.config.build.lib ? publicPath : 'auto',
      filename: `${staticDir}js/[name].[contenthash:8].js`,
      assetModuleFilename: `${staticDir}${store.config.build.assetsDir}/[name].[contenthash:8][ext][query]`,
      environment,
      // scriptType: isESM ? 'module' : 'text/javascript',
      pathinfo: false, //在打包数千个模块的项目中，这会导致造成垃圾回收性能压力
    }
  }
  get resolve(): Configuration['resolve'] {
    const configResolve = {...{extends: true}, ...store.config.resolve}
    const rs = {
      modules: [
        'node_modules', //默认
        store.resolve('node_modules'), // 项目
        store.empResolve('node_modules'), // emp
        store.resolve('src'), // 项目src
      ],
      alias: {
        [store.config.appSrc]: store.appSrc,
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
    }

    // 合并 config.resolve 配置项
    if (configResolve.modules) {
      rs.modules = configResolve.extends === false ? configResolve.modules : [...rs.modules, ...configResolve.modules]
    }
    if (configResolve.alias) {
      rs.alias = configResolve.extends === false ? configResolve.alias : {...rs.alias, ...configResolve.alias}
    }
    if (configResolve.extensions) {
      rs.extensions =
        configResolve.extends === false ? configResolve.extensions : [...rs.extensions, ...configResolve.extensions]
    }
    store.config.resolve = {...{extends: configResolve.extends}, ...rs}
    return rs
  }
  get stats(): Configuration['stats'] {
    return {
      // colors: true,
      // preset: 'none',
      preset: store.config.debug.level === 'error' ? 'errors-only' : 'errors-warnings',
      // moduleTrace: true,
      // errorDetails: true,
    }
  }
}
export default WPCommon
