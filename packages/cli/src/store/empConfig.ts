import type {Output, Resolve} from '@rspack/core'
import {logger} from 'src/helper'
import {loadConfig} from 'src/helper/loadConfig'
import {deepAssign} from 'src/helper/utils'
import type {GlobalStore} from 'src/store'
import {LifeCycle} from 'src/store/lifeCycle'
import type {
  BuildType,
  DebugType,
  EmpOptions,
  HtmlType,
  ModuleTransform,
  RsdoctorRspackPluginOptions,
  RsTarget,
  ServerType,
} from 'src/types/config'
// 重构server
export class EmpConfig {
  private store!: GlobalStore
  /**
   * 项目代码路径
   * @default 'src'
   */
  public appSrc = 'src'
  /**
   * 项目代码入口文件 如 `src/index.js`
   * (*)entries 设置后 该选项失效
   * @default 'index.js'
   */
  public appEntry = ''
  /**
   * publicPath 根路径 可参考webpack,业务模式默认为 auto
   * html 部分 publicPath 默认为 undefined,可设置全量域名或子目录适配，也可以单独在html设置 Public
   *
   * @default undefined
   */
  public base = ''
  public target: RsTarget = []
  private assign<T>(t: T, s: any): T {
    s = s || {}
    return deepAssign(t, s)
  }
  /**
   * 是否启动 esm 模块
   * @default true
   */
  public isESM = false
  public checkIsESM(target: string) {
    return ['es3', 'es5'].indexOf(target) === -1
  }
  public lifeCycle!: LifeCycle
  async setup(store: GlobalStore) {
    this.store = store
    //=== before sync emp-config.js
    await this.syncEmpOptions()
    await this.setupEmpOptions()
    /**
     * 开始执行 LifeCycle 周期
     */
    this.lifeCycle = new LifeCycle(this.store.empOptions.lifeCycle)
    await this.lifeCycle.afterGetEmpOptions()
    // 是否启动 is ESM
    this.isESM = this.checkIsESM(this.build.target)
    if (this.store.empOptions.target) {
      this.target = this.store.empOptions.target
      if (Array.isArray(this.target) && !this.target.includes(this.build.target)) {
        this.target.push(this.build.target)
      }
    } else {
      this.target = ['web', this.build.target]
    }

    // setup common val of empConfig
    const {appSrc, base, appEntry} = this.store.empOptions
    if (appSrc) this.appSrc = appSrc
    if (base) this.base = base
    if (appEntry) this.appEntry = appEntry
  }
  /**
   * 同步完所有配置后的处理
   */
  private async setupEmpOptions() {
    await this.store.server.setupOnEmpOptionSync()
  }
  async chain() {
    if (this.store.empOptions.chain) {
      await this.store.empOptions.chain(this.store.chain)
    }
  }
  async plugins() {
    const runPromiseFuns: any[] = []
    if (
      this.store.empOptions.plugins &&
      Array.isArray(this.store.empOptions.plugins) &&
      this.store.empOptions.plugins.length > 0
    ) {
      // await Promise.all(this.store.empOptions.plugins)
      this.store.empOptions.plugins.map(fn => {
        runPromiseFuns.push(fn.rsConfig(this.store))
      })
      await Promise.all(runPromiseFuns)
    }
  }
  get debug() {
    let rsdoctor: RsdoctorRspackPluginOptions | boolean = false
    if (this.store.cliOptions.doctor) {
      rsdoctor = {
        // supports: {
        //   generateTileGraph: true,
        // },
      }
    }
    //
    return this.assign<Required<DebugType>>(
      {
        loggerLevel: 'info',
        clearLog: true,
        progress: true,
        showRsconfig: false,
        showPerformance: false,
        rsdoctor,
        infrastructureLogging: {
          appendOnly: true,
          level: 'warn',
        },
        newTreeshaking: this.store.empConfig.isESM,
        devShowAllLog: false,
        showScriptDebug: false,
        // parallelCodeSplitting: true,
        cssChunkingPlugin: true,
        warnRuleAsWarning: true,
      },
      this.store.empOptions.debug,
    )
  }
  get build() {
    const staticDir = this.store.empOptions.build?.staticDir ? `${this.store.empOptions.build?.staticDir}/` : ''
    return this.assign<Required<BuildType>>(
      {
        outDir: 'dist',
        staticDir,
        assetsDir: 'assets',
        publicDir: 'public',
        chunkIds: this.store.isDev ? 'named' : 'deterministic',
        moduleIds: this.store.isDev ? 'named' : 'deterministic',
        sourcemap: this.store.isDev,
        minify: !this.store.isDev,
        minOptions: {},
        cssminOptions: {},
        target: 'es5',
        polyfill: {
          mode: undefined,
          entryCdn: undefined,
          splitChunks: false,
          include: [],
          coreJsFeatures: 'stable',
          externalHelpers: false,
          browserslist: this.store.browserslistOptions.default,
          // include:['es.object.values', 'es.object.entries', 'es.array.flat']
        },
        swcConfig: {},
        devtool: this.store.isDev ? 'cheap-module-source-map' : 'source-map',
        // devtool: 'source-map',
      },
      {...this.store.empOptions.build, staticDir},
    )
  }
  get html() {
    const meta: any = this.store.empOptions.html?.template
      ? {}
      : {
          charset: {charset: 'utf-8'},
          'http-equiv': {'http-equiv': 'X-UA-Compatible', content: 'IE=edge'},
          viewport: {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0',
          },
          keywords: {keywords: ''},
          description: {description: ''},
        }
    const op = this.assign<HtmlType>(
      {
        lang: 'zh-CN',
        title: 'EMP',
        inject: 'body',
        minify: !this.store.isDev,
        scriptLoading: !this.isESM ? 'defer' : 'module',
        meta,
        cache: this.cache === false ? false : true,
        tags: [],
      },
      this.store.empOptions.html,
    )
    return op
  }
  get entries() {
    return this.store.empOptions.entries ? this.store.empOptions.entries : {}
  }
  get server(): ServerType {
    const sf: ServerType = {
      host: `0.0.0.0`,
      port: 8000,
      open: process.platform === 'darwin',
      // liveReload: false,
      hot: true,
      watchFiles: ['src/**/*.html'],
      static: [
        {
          directory: this.store.publicDir,
          watch: this.store.isDev,
        },
        // 暴露 d.ts 文件
        /*  {
          directory: this.store.outDir,
          watch: this.store.isDev,
          publicPath: this.base,
          staticOptions: {
            setHeaders: function (res: any, path: string) {
              if (path.toString().endsWith('.d.ts')) res?.set('Content-Type', 'application/javascript; charset=utf-8')
            },
          },
        }, */
      ],
      allowedHosts: ['all'],
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      // client: {
      //   webSocketURL: 'ws://172.29.104.208:8000/ws',
      // },
    }
    // server http2 已经弃置 需要特殊处理
    if (this.store.empOptions.server?.http2) {
      this.store.server.httpsType = 'h2'
      delete this.store.empOptions.server.http2
    }
    return this.assign(sf, this.store.empOptions.server)
  }
  get css() {
    const cb: Required<EmpOptions['css']> = this.assign(
      {
        sass: {mode: 'modern', warnRuleAsWarning: this.store.empConfig.debug.warnRuleAsWarning},
        // 默认开启 Less 的兼容选项，便于适配常见 UI 生态与旧 Less 写法
        less: {lessOptions: {javascriptEnabled: true, math: 'always'}},
        prifixName: '',
      },
      this.store.empOptions.css,
    )
    return cb
  }
  get output(): Output {
    //TODO 考虑辨识度更好的方案
    const contenthashName = !this.store.isDev ? '.[contenthash:8]' : '.[contenthash:8]'
    //HMR is not working for css when output.cssFilename contains [hash] or [contenthash]
    const cssContentHashName = !this.store.isDev ? '.[contenthash:8]' : ''
    const {assetsDir, staticDir} = this.store.empConfig.build
    const output: Output = {
      publicPath: this.store.empConfig.base ? this.store.empConfig.base : 'auto',
      // publicPath: this.base,
      crossOriginLoading: 'anonymous',
      filename: `${staticDir}js/[name]${contenthashName}.js`,
      cssFilename: `${staticDir}css/[name]${cssContentHashName}.css`,
      cssChunkFilename: `${staticDir}css/[name]${cssContentHashName}.css`,
      assetModuleFilename: `${staticDir}${assetsDir}/[name]${contenthashName}[ext][query]`,
      path: this.store.outDir,
      clean: !this.store.isDev,
      /**
       * 默认值： 默认使用 output.library 名称或者上下文中的 package.json 的 包名称（package name），
       * 如果两者都不存在，值为 ''
       * 此选项决定了在全局环境下为防止多个 Rspack 运行时 冲突所使用的唯一名称。
       * 将用于生成唯一全局变量 chunkLoadingGlobal
       * chunkLoadingGlobal 此选项决定了 Rspack 用于加载 chunk 的全局变量。
       */
      uniqueName: this.store.uniqueName,
      // Rspack 会在 CSS 中添加一些元信息，用以解析 CSS modules，此配置决定是否压缩元信息。
      // cssHeadDataCompression: false,// DeprecationWarning: cssHeadDataCompression is not used now
    }
    // 添加后 ESM 样式失效 待观察
    // if (this.isESM) {an
    //   output = this.assign(
    //     {
    //       chunkFormat: 'module',
    //       chunkLoading: 'import',
    //       library: {
    //         type: 'module',
    //       },
    //     },
    //     output,
    //   )
    // }
    // console.log('output', output)
    // 防止清除 dist目录 导致 类型文件丢失
    // if (this.store.isDev && this.store.empConfig.empShare.dts !== false) {
    //   output.clean = false
    // }
    return this.assign(output, this.store.empOptions.output)
  }
  get define() {
    let dlist: any = {mode: this.store.mode, env: this.store.cliOptions.env}
    if (this.store.empOptions.define) {
      dlist = {...dlist, ...this.store.empOptions.define}
    }
    return this.setDefine(dlist)
  }
  get tsCheckerRspackPlugin() {
    let tp = {}
    if (!this.store.empOptions.tsCheckerRspackPlugin) {
      return false
    } else if (typeof this.store.empOptions.tsCheckerRspackPlugin === 'object') {
      tp = this.store.empOptions.tsCheckerRspackPlugin
    }
    return this.assign({}, tp)
  }
  private setDefine(o: {[k: string]: any}): {[k: string]: string} {
    const defineFix = this.store.empOptions.defineFix ? this.store.empOptions.defineFix : this.isESM ? 'esm' : 'cjs'
    const options: any = {}
    Object.keys(o).map(key => {
      if (defineFix === 'all') {
        options[`import.meta.env.${key}`] = JSON.stringify(o[key])
        options[`process.env.${key}`] = JSON.stringify(o[key])
      } else if (defineFix === 'esm') {
        options[`import.meta.env.${key}`] = JSON.stringify(o[key])
      } else if (defineFix === 'cjs') {
        options[`process.env.${key}`] = JSON.stringify(o[key])
      } else if (defineFix === 'none') {
        options[`${key}`] = JSON.stringify(o[key])
      }
    })
    return options
  }
  get externals() {
    // const o = this.assign(this.empShareLib.externals, this.store.empOptions.externals)
    const o = this.assign({}, this.store.empOptions.externals)
    return o
  }
  get resolve() {
    const rl = deepAssign<Resolve>(
      {
        // modules: [this.store.resolve('src'), 'node_modules'],
        alias: {
          src: this.store.resolve('src'),
          '@': this.store.resolve('src'),
        },
        extensions: [
          '...',
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
      this.store.empOptions.resolve,
    )
    return rl
  }
  private async syncEmpOptions() {
    const timeTag = 'store.jiti.loadConfig.empConfig'
    logger.time(timeTag)
    if (!this.store.rootPaths.empConfig) return
    // const {default: empOptionsFn} = await loadConfig(this.store.rootPaths.empConfig)
    const {default: empOptionsFn} = await loadConfig(this.store.rootPaths.empConfig)
    // console.log('empOptionsFn', empOptionsFn)
    if (typeof empOptionsFn === 'function') {
      this.store.empOptions = await empOptionsFn(this.store)
    } else {
      this.store.empOptions = empOptionsFn || {}
    }
    logger.timeEnd(timeTag)
  }
  get moduleTransformRule() {
    // const moduleTransformExclude: RuleSetRule['exclude'] = {and: [/(node_modules|bower_components)/]}
    const {moduleTransform} = this.store.empOptions
    const tf: ModuleTransform = this.assign({defaultExclude: false}, moduleTransform)
    const moduleTransformExclude: any = {and: [], not: []}
    if (tf.defaultExclude === true) {
      moduleTransformExclude.and.push(/(node_modules|bower_components)/)
    }
    if (tf?.exclude) {
      moduleTransformExclude.and = moduleTransformExclude.and.concat(tf.exclude)
    }
    if (moduleTransform?.include) {
      moduleTransformExclude.not = tf.include
    }
    // console.log('moduleTransformExclude', moduleTransformExclude)
    return moduleTransformExclude
  }
  get cacheDir() {
    return this.store.empOptions.cacheDir ? this.store.empOptions.cacheDir : 'node_modules/.emp-cache'
  }
  get cache() {
    if (this.store.empOptions.cache === false) return false
    return this.store.empOptions.cache ? this.store.empOptions.cache : 'persistent'
  }
  get ignoreWarnings() {
    return this.store.empOptions.ignoreWarnings
      ? this.store.empOptions.ignoreWarnings
      : [
          /Conflicting order/,
          //  /Failed to parse source map/
        ]
  }
  get autoPages() {
    let autoPages
    if (this.store.empOptions.autoPages) {
      autoPages = typeof this.store.empOptions.autoPages === 'boolean' ? {} : this.store.empOptions.autoPages
      autoPages = this.assign({path: 'pages'}, autoPages)
    }
    return autoPages
  }
}
export default new EmpConfig()
