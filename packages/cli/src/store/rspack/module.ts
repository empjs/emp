import path from 'node:path'
import type {SwcLoaderOptions} from '@rspack/core'
import {deepAssign, getPkgVersion} from 'src/helper/utils'
import type {GlobalStore} from 'src/store'
//
class RspackModule {
  public store!: GlobalStore
  private swcJsOptions: SwcLoaderOptions = {}
  private swcTsOptions: SwcLoaderOptions = {}
  private coreJs = {
    version: '3',
    alias: '',
    path: '',
  }
  async setup(store: GlobalStore) {
    this.store = store
    this.swcInitOptions()
    await this.run()
  }
  async run() {
    const runFuns = [this.jsDataUrl(), this.files(), this.scripts(), this.rspackGenerator(), this.rspackParser()]
    await this.store.empConfig.lifeCycle.beforeModule()
    await Promise.all(runFuns)
    await this.store.empConfig.lifeCycle.afterModule()
  }
  private rspackGenerator() {
    const prifixName = this.store.empConfig.css?.prifixName ? `${this.store.empConfig.css?.prifixName}-` : ''
    const localIdentName = this.store.isDev
      ? `${prifixName}[path][name]-[local]-[hash:5]`
      : `${prifixName}[local]-[hash:5]`

    this.store.chain.merge({
      module: {
        generator: {
          // css: {localIdentName},
          // 'css/auto': {localIdentName},
          // 'css/module': {localIdentName},
          // Generator options for css/auto modules
          'css/auto': {
            exportsConvention: 'as-is',
            exportsOnly: false,
            localIdentName,
            esModule: true,
          },
          // Generator options for `css` modules
          css: {
            exportsOnly: false,
            esModule: true,
          },
          // Generator options for css/module modules
          'css/module': {
            exportsConvention: 'as-is',
            exportsOnly: false,
            localIdentName,
            esModule: true,
          },
          // Generator options for `json` modules
          json: {
            JSONParse: true,
          },
        },
      },
    })
  }
  private rspackParser() {
    const namedExports = false
    this.store.chain.merge({
      module: {
        parser: {
          // javascript 模块的解析器选项
          javascript: {
            dynamicImportMode: 'lazy',
            dynamicImportPrefetch: false,
            dynamicImportPreload: false,
            url: true,
            importMeta: true,
          },
          // CSS 模块的解析器选项
          css: {namedExports},
          'css/auto': {namedExports},
          'css/module': {namedExports},
        },
      },
    })
  }
  private get isPolyfill() {
    // return this.store.empConfig.build.polyfill && ['es3', 'es5'].includes(this.store.empConfig.build.target)
    return !!this.store.empConfig.build.polyfill.mode
  }
  private swcParser(lang: string) {
    switch (lang) {
      case 'js':
        return {
          syntax: 'ecmascript',
          jsx: true,
          decorators: true,
          decoratorsBeforeExport: false,
        }
      case 'ts':
        return {
          syntax: 'typescript',
          decorators: true,
          tsx: true,
          dynamicImport: true,
        }
    }
  }
  private swcJsc(lang: string) {
    const {target, polyfill} = this.store.empConfig.build
    const {externalHelpers} = polyfill
    return {
      parser: this.swcParser(lang),
      transform: {},
      target,
      externalHelpers,
      // Requires v1.2.50 or upper and requires target to be es2016 or upper.
      // keepClassNames: true,
      // https://github.com/swc-project/swc/issues/6403  Avoid the webpack magic comment to be removed
      preserveAllComments: true,
    }
  }
  private get swcCoreVersion() {
    const [major, minor] = this.coreJs.version.split('.')
    return `${major}.${minor}`
  }
  private swcOptions(lang: string): SwcLoaderOptions {
    const op: any = {
      jsc: deepAssign(this.swcJsc(lang), {...this.store.empConfig.build.swcConfig}),
      /**
       * externalHelpers *
       * mode usage *
       */
      // Source Type
      isModule: 'unknown',
    }
    if (this.isPolyfill) {
      delete op.jsc.target
      //
      op.env = {
        coreJs: this.swcCoreVersion,
        // modules: false,
        // loose: true,
        // debug: true,
        targets: this.store.empConfig.build.polyfill.browserslist,
      }
      /**
       * ESM Mode 没有 entry
       */
      if (!this.store.empConfig.isESM) {
        op.env.mode = this.store.empConfig.build.polyfill.mode
      }
      if (this.store.empConfig.build.polyfill.mode === 'usage') {
        /**
         * enable esnext polyfill
         * https://github.com/swc-project/swc/blob/b43e38d3f92bc889e263b741dbe173a6f2206d88/crates/swc_ecma_preset_env/src/corejs3/usage.rs#L75
         */
        op.env.shippedProposals = true
        /**
         * TODO 临时支持 Module Federation
         */
        op.env.include = this.store.empConfig.build.polyfill.include
      }
    }
    return op
  }
  swcInitOptions() {
    const {externalHelpers} = this.store.empConfig.build.polyfill
    if (externalHelpers) {
      this.store.chain.resolve.alias.set('@swc/helpers', path.dirname(require.resolve('@swc/helpers/package.json')))
    }
    //
    this.coreJs.path = require.resolve('core-js/package.json')
    const version = getPkgVersion(this.coreJs.path)
    if (version) this.coreJs.version = version
    this.coreJs.alias = path.dirname(this.coreJs.path)
    if (this.store.empConfig.build.polyfill.mode) {
      this.store.chain.resolve.alias.set('core-js', this.coreJs.alias)
      // if (this.store.empConfig.build.polyfill === 'usage') {
      this.store.chain.module.rule('javascript').exclude.add(/core-js/)
      this.store.chain.module.rule('typescript').exclude.add(/core-js/)
      // }
    }
    //
    this.swcTsOptions = this.swcOptions('ts')
    this.swcJsOptions = this.swcOptions('js')
    //
  }
  jsDataUrl() {
    this.store.chain.module
      .rule('jsDataUrl')
      .merge({mimetype: {or: ['text/javascript', 'application/javascript']}})
      .resolve.set('fullySpecified', false)
      .end()
      .use('swcJsParser')
      .loader('builtin:swc-loader')
      .options(this.swcJsOptions)
  }
  async scripts() {
    /**
     * module.rule.sideEffects
     * 你可以使用 module.rule.sideEffects 覆盖某些模块的 sideEffects 选项。
     */
    // const sideEffects = false
    // const exclude = this.store.empConfig.moduleTransformRule
    // const exclude: any = [{and: [/(node_modules|bower_components)/], not: [/@module-federation/]}]
    const exclude: any = []
    const {rule, use} = this.store.chainName
    this.store.chain.merge({
      module: {
        parser: {
          javascript: {
            exportsPresence: 'error',
            importExportsPresence: 'error',
          },
        },
        rule: {
          [rule.mjs]: {
            test: /\.m?js/,
            resolve: {
              fullySpecified: false,
            },
          },
          [rule.typescript]: {
            test: /\.(ts|tsx)$/,
            exclude,
            // sideEffects, // 标记模块是否存在副作用。
            use: {
              [use.swc]: {
                loader: 'builtin:swc-loader',
                options: this.swcTsOptions,
              },
            },
          },
          [rule.javascript]: {
            test: /\.((m|c)?js|jsx)$/,
            exclude,
            // sideEffects, // 标记模块是否存在副作用。
            use: {
              [use.swc]: {
                loader: 'builtin:swc-loader',
                options: this.swcJsOptions,
              },
            },
          },
          // [rule.sourceMap]: {
          //   test: /\.[tj]sx?$/,
          //   enforce: 'pre',
          //   use: {
          //     [use.sourceMap]: {
          //       loader: require.resolve('source-map-loader'),
          //     },
          //   },
          // },
        },
      },
    })
  }

  async files() {
    const {rule} = this.store.chainName
    this.store.chain.merge({
      module: {
        rule: {
          [rule.svg]: {
            test: /\.svg$/,
            type: 'asset/resource',
          },
        },
      },
    })

    // asset/inline
    this.store.chain.merge({
      module: {
        rule: {
          [rule.inline]: {
            resourceQuery: /inline/,
            type: 'asset/inline',
          },
        },
      },
    })
    // 使用 type: 'asset/source' 替换 raw-loader
    this.store.chain.merge({
      module: {
        rule: {
          [rule.raw]: {
            resourceQuery: /raw/,
            type: 'asset/source',
          },
        },
      },
    })
    // asset/resource
    //  test: /\.(png|jpe?g|gif|webp|ico|otf|ttf|eot|woff|woff2|svga)$/i,
    this.store.chain.merge({
      module: {
        rule: {
          [rule.image]: {
            test: /\.(png|jpe?g|gif|webp|ico)$/i,
            type: 'asset/resource',
          },
          [rule.font]: {
            test: /\.(|otf|ttf|eot|woff|woff2)$/i,
            type: 'asset/resource',
          },
          [rule.svga]: {
            test: /\.(svga)$/i,
            type: 'asset/resource',
          },
        },
      },
    })
  }
}
export default new RspackModule()
