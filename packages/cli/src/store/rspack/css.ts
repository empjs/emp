import type {GlobalStore} from 'src/store'
export class RspackCss {
  public store!: GlobalStore
  async setup(store: GlobalStore) {
    this.store = store
    const runFuns = [this.sass(), this.less(), this.css()]
    await Promise.all(runFuns)
  }
  async sass() {
    const {rule, use} = this.store.chainName
    const options: any = {}
    const {sass} = this.store.empConfig.css
    if (sass.mode === 'modern') {
      options.implementation = sass.implementation ? sass.implementation : require.resolve('sass-embedded')
      // options.api = sass.api ? sass.api : 'legacy'
      /**
       * Using modern-compiler and sass-embedded together significantly improve performance and decrease built time.
       * We strongly recommend their use. We will enable them by default in a future major release.
       * https://github.com/webpack-contrib/sass-loader?tab=readme-ov-file#api
       */
      options.api = `modern-compiler`
      options.sourceMap = this.store.empConfig.build.sourcemap.css
      if (sass.sassOptions) options.sassOptions = sass.sassOptions
    }
    // prepend the entry's content
    if (typeof sass.additionalData !== 'undefined') {
      options.additionalData = sass.additionalData
    }
    /**
     * webpackImporter default true
     * warnRuleAsWarning default false
     */
    if (typeof sass.warnRuleAsWarning !== 'undefined') {
      options.warnRuleAsWarning = sass.warnRuleAsWarning
    }
    if (typeof sass.webpackImporter !== 'undefined') {
      options.webpackImporter = sass.webpackImporter
    }
    //
    this.store.chain.merge({
      module: {
        rule: {
          [rule.sass]: {
            test: /\.(sass|scss)$/,
            use: {
              [use.sass]: {
                loader: require.resolve('sass-loader'),
                options,
              },
            },
            type: 'css/auto',
          },
        },
      },
    })
  }
  async less() {
    const {rule, use} = this.store.chainName
    const {lessOptions} = this.store.empConfig.css.less
    const lessLoader = {
      loader: require.resolve('less-loader'),
      options: {
        lessOptions,
      },
    }
    this.store.chain.merge({
      module: {
        rule: {
          [rule.less]: {
            test: /\.less$/,
            use: {
              [use.less]: lessLoader,
            },
            type: 'css/auto',
          },
        },
      },
    })
  }
  async css() {
    const {rule} = this.store.chainName
    this.store.chain.merge({
      module: {
        rule: {
          [rule.css]: {
            test: /\.css$/,
            use: {},
            type: 'css/auto',
          },
        },
      },
    })
  }
}
export default new RspackCss()
