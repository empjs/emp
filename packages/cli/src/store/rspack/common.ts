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
  async common() {
    this.store.merge({
      name: this.store.pkg.name,
      node: {
        global: true,
      },
      experiments: {
        nativeWatcher: true, //导致 二次启动后 热更新失效
        // rspackFuture: {
        //   // disableTransformByDefault: false, // 开启默认转换
        //   //  移除 experiments.rspackFuture.disableApplyEntryLazily
        //   // disableApplyEntryLazily: true,
        //   // rspack 0.6 默认开启新版 tree shaking
        //   newTreeshaking: this.store.empConfig.debug.newTreeshaking, // 该功能启用了与 webpack 相同的新摇树优化实现，可以生成更高效和更小的代码。
        // },
        outputModule: this.store.empConfig.isESM, //将尽可能输出符合 ECMAScript 语法的代码
        topLevelAwait: true,
        asyncWebAssembly: true,
        // lazyCompilation: this.store.isDev, // 开启懒编译功能
        // lazyCompilation: {
        //   imports: true,
        //   entries: true,
        //   test(module: any) {
        //     console.log(module)
        //     const isMyClient = module.nameForCondition().endsWith('reactRefreshEntry.js')
        //     console.log(module, isMyClient)
        //     return !isMyClient
        //   },
        // },
        css: true,
        /**
         *  是否增量地进行重构建，加快重构建的速度。
         *  In a case of 10000 React components, the HMR becomes 38% faster:
         */
        // 用于控制是否开启 Rspack 未来的默认行为
        rspackFuture: {
          // 用于在生成产物中注入当前使用的 Rspack 信息
          bundlerInfo: {force: false},
        },
        // 缓存设置
        cache: {
          type: this.store.empConfig.cache === 'persistent' ? 'persistent' : 'memory',
          buildDependencies: getBuildDependencies(),
          version: this.store.empPkg.version,
        },
        // 控制是否启用增量构建功能 https://rspack.rs/zh/config/experiments#experimentsincremental
        incremental: 'advance-silent',
        // 如果你的项目中包含较多的动态引用，开启后可以显著降低 code splitting 阶段耗时 https://rspack.rs/zh/config/experiments#experimentsparallelcodesplitting
        parallelCodeSplitting: this.store.empConfig.debug.parallelCodeSplitting,
        // 对应的 loader 会被发送到 worker threads 执行 https://rspack.rs/zh/config/experiments#experimentsparallelloader
        parallelLoader: true,
      },
      target: this.store.empConfig.target, // default [web,es5]
      infrastructureLogging: this.store.empConfig.debug.infrastructureLogging,
      context: this.store.root,
      mode: this.store.mode,
      cache: !!this.store.empConfig.cache,
      // devtool: this.store.empConfig.build.sourcemap ? 'source-map' : false, //Recommended
      devtool: this.store.empConfig.build.sourcemap ? this.store.empConfig.build.devtool : false, //Recommended
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
      splitChunks: {
        chunks: 'async', // 仅针对异步引入的模块进行优化，确保这些模块在需要时被分离出来，而不是在初始加载时全部打包
        //   chunks: 'all',
        cacheGroups: {
          // defaultVendors: {
          //   filename: 'vendors-[name].js',
          //   enforce: true,
          // },
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
