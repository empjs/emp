import {ExperimentCacheOptions} from '@rspack/core'
import fs from 'fs-extra'
import {getBuildDependencies} from 'src/helper/loadConfig'
import type {GlobalStore} from 'src/store'

class RspackCommon {
  public store!: GlobalStore
  async setup(store: GlobalStore) {
    this.store = store
    const runFuns = [
      this.common(),
      this.stats(),
      this.devServer(),
      //  this.assets(),
      this.optimization(),
      this.checkTsconfig(),
    ]
    //
    await Promise.all(runFuns)
  }
  /**
   * 适配缓存多样性设置
   */
  get cache(): ExperimentCacheOptions {
    // return this.store.empConfig.cache
    if (this.store.empConfig.cache === false) {
      return false
    }
    let defaultCache: ExperimentCacheOptions = {
      type: this.store.empConfig.cache === 'persistent' ? 'persistent' : 'memory',
      buildDependencies: getBuildDependencies(),
      version: this.store.empConfig.server.port
        ? `${this.store.empPkg.version}_${this.store.empConfig.server.port}`
        : this.store.empPkg.version,
    }
    if (typeof this.store.empConfig.cache === 'object') {
      defaultCache = this.store.deepAssign(defaultCache, this.store.empConfig.cache)
    }
    // console.log('defaultCache', defaultCache)
    return defaultCache
  }
  /**
   * 解决单项目多开的缓存问题
   */
  get name() {
    const portName = this.store.empConfig.server.port ? `_${this.store.empConfig.server.port}` : ''
    const pkgPortName = this.store.pkg.name + portName
    return pkgPortName
  }
  async common() {
    this.store.merge({
      name: this.name,
      node: {
        global: true,
      },
      experiments: {
        /**
         * 基于 Rust 打造了原生的文件系统监听器
         * 观察:导致 二次启动后 热更新失效
         * https://rspack.rs/zh/blog/announcing-1-5#%E6%9B%B4%E5%BF%AB%E7%9A%84%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F%E7%9B%91%E5%90%AC%E5%99%A8
         */
        nativeWatcher: true,
        /**
         * 自动识别无副作用的 barrel 文件，对其中的重导出进行延迟构建优化，只在真正需要时才会解析和构建相关模块
         * https://rspack.rs/zh/blog/announcing-1-5#barrel-%E6%96%87%E4%BB%B6%E4%BC%98%E5%8C%96
         */
        lazyBarrel: true,
        // https://rspack.rs/zh/blog/announcing-1-5#%E5%B8%B8%E9%87%8F%E5%86%85%E8%81%94%E4%BC%98%E5%8C%96
        // inlineConst: true, // 已废弃 如需关闭该行为，可通过 optimization.inlineExports 来控制
        // inlineEnum: true, // 已废弃 使用 collectTypeScriptInfo.exportedEnum 控制是否收集导出的 enum 信息 , 使用 optimization.inlineExports 来控制是否内联 enum
        // https://rspack.rs/zh/config/experiments#experimentstypereexportspresence
        // typeReexportsPresence: true, // 已废弃 类型重导出存在性检查现在由 module.parser.javascript.typeReexportsPresence 和 builtin:swc-loader collectTypeScriptInfo.typeExports 控制。
        outputModule: this.store.empConfig.isESM, //将尽可能输出符合 ECMAScript 语法的代码
        topLevelAwait: true,
        asyncWebAssembly: true,
        css: true,
        // 用于控制是否开启 Rspack 未来的默认行为
        rspackFuture: {
          // 用于在生成产物中注入当前使用的 Rspack 信息
          bundlerInfo: {force: false},
        },
        // 缓存设置
        cache: this.cache,
        // 控制是否启用增量构建功能 https://rspack.rs/zh/config/experiments#experimentsincremental
        incremental: 'advance-silent',
        // 如果你的项目中包含较多的动态引用，开启后可以显著降低 code splitting 阶段耗时 https://rspack.rs/zh/config/experiments#experimentsparallelcodesplitting
        // parallelCodeSplitting: this.store.empConfig.debug.parallelCodeSplitting,
        // 对应的 loader 会被发送到 worker threads 执行 https://rspack.rs/zh/config/experiments#experimentsparallelloader
        parallelLoader: true,
      },
      /**
       * 懒编译，对提高多入口应用（MPA）或大型单页面应用（SPA）的 dev 启动性能会非常有帮助
       * https://rspack.rs/zh/config/lazy-compilation#lazycompilation
       */
      lazyCompilation: this.store.isDev,
      target: this.store.empConfig.target, // default [web,es5]
      infrastructureLogging: this.store.empConfig.debug.infrastructureLogging,
      context: this.store.root,
      mode: this.store.mode,
      cache: !!this.store.empConfig.cache,
      // devtool: this.store.empConfig.build.sourcemap ? 'source-map' : false, //Recommended
      devtool: this.store.empConfig.build.sourcemap.js, //Recommended
      // devtool: false,
      //       builtins: {
      //         /**
      // 'builtins.devFriendlySplitChunks = true' has been deprecated, please switch to 'builtins.devFriendlySplitChunks = false' to use webpack's behavior.
      //     Set env `RSPACK_DEP_WARNINGS` to 'false' to temporarily disable deprecation warnings.
      //          */
      //         // devFriendlySplitChunks: true,
      //         // css: {
      //         //   modules: {
      //         //     // exportsOnly: false,
      //         //     localIdentName: this.store.isDev ? '[path][name]-[local]-[hash:5]' : '[local]-[hash:5]',
      //         //   },
      //         // },
      //       },
      output: this.store.empConfig.output,
      resolve: this.store.empConfig.resolve,
      externals: this.store.empConfig.externals,
      ignoreWarnings: this.store.empConfig.ignoreWarnings,
      watchOptions: {
        ignored: ['**/node_modules/**', '**/@mf-types/**'],
      },
    })
  }
  async checkTsconfig() {
    const tsConfigPath = this.store.resolve('tsconfig.json')
    const isExist = await fs.exists(tsConfigPath)
    if (isExist) {
      const resolve: any = {}
      if (this.store.isOldRspack) {
        resolve.tsConfigPath = tsConfigPath
      } else {
        resolve.tsConfig = tsConfigPath
      }
      //
      this.store.merge({resolve})
    }
  }
  async stats() {
    this.store.merge({
      stats: {
        colors: true,
        all: false,
        assets: false,
        chunks: false,
        timings: true,
        version: true,
      },
    })
  }
  async devServer() {
    this.store.merge({
      devServer: this.store.empConfig.server,
    })
  }
  /* async assets() {
    this.store.chain.merge({
      module: {
        rule: {
          assets: {
            test: /\.(png|jpe?g|gif|webp|ico|otf|ttf|eot|woff|woff2|svga)$/i,
            type: 'asset/resource',
          },
        },
      },
    })
  } */
  async optimization() {
    const optimization: any = {
      // moduleIds: 'named',
      // chunkIds: 'named',
      moduleIds: this.store.empConfig.build.moduleIds,
      chunkIds: this.store.empConfig.build.chunkIds,
      minimize: this.store.empConfig.build.minify,
      // usedExports: false, // 识别和排除未使用的导出 1.0.13 打开后会导致部分浏览器报错
      /**
        'single'：将所有的运行时代码提取到一个单独的文件中，适用于大多数情况。
        'multiple'：为每个入口点生成一个独立的运行时 chunk，适用于多入口应用。
       */
      // runtimeChunk: 'single',
      // 代码分包优化：提升缓存命中率与首屏加载速度
      splitChunks: {
        // chunks: 'async', // 仅针对异步引入的模块进行优化，确保这些模块在需要时被分离出来，而不是在初始加载时全部打包
        // 对所有类型的 chunk（同步/异步）都进行分包处理
        chunks: 'all',
        // 小于该值的模块不参与分包，避免产生过多的小 chunk
        minSize: 20000,
        // 一个模块被至少引用多少次才会参与默认分包
        minChunks: 1,
        // 生成 chunk 名称时的分隔符，便于阅读与定位
        automaticNameDelimiter: '-',
        cacheGroups: {
          // 三方依赖统一打入 vendors，提升长期缓存命中率
          vendors: {
            // 匹配 node_modules 下的模块
            test: /[\\/]node_modules[\\/]/,
            // 生成的 chunk 名称
            name: 'vendor',
            // 分组优先级（数值越大优先级越高）
            priority: -10,
            // 复用已存在的 chunk，避免重复打包
            reuseExistingChunk: true,
          },
          // 默认分组：被多次引用的模块会被抽离复用
          default: {
            // 至少被引用次数
            minChunks: 2,
            // 分组优先级
            priority: -20,
            // 复用已存在的 chunk
            reuseExistingChunk: true,
          },
        },
      },
    }
    if (
      this.store.empConfig.build.polyfill.mode === 'entry' &&
      this.store.empConfig.build.polyfill.splitChunks &&
      !this.store.empConfig.build.polyfill.entryCdn
    ) {
      optimization.splitChunks.cacheGroups.coreJs = {
        test: /[\\/]node_modules[\\/](core-js)[\\/]/,
        name: 'coreJs',
        chunks: 'all',
        enforce: true,
      }
    }
    this.store.chain.merge({
      optimization,
    })
  }
}
export default new RspackCommon()
