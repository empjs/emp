import rspack, {type SourceMapDevToolPluginOptions} from '@rspack/core'
import fs from 'fs'
import type {GlobalStore} from 'src/store'
import type {RsdoctorRspackPluginOptions} from 'src/types/config'
import {TsCheckerRspackPlugin} from 'ts-checker-rspack-plugin'
import {EmpPolyfillPlugin} from './builtInPlugin'

class RspackPlugin {
  public store!: GlobalStore
  async setup(store: GlobalStore) {
    this.store = store
    const runFuns = [
      this.define(),
      this.anylayze(),
      this.progress(),
      this.copy(),
      ///////////////////////
      this.minify(),
      this.redoctor(),
      // this.sourceMapDevToolPlugin(),
      this.tsCheckerRspackPlugin(),
      this.cssChunkingPlugin(),
    ]
    this.beforeLifeCycle()
    await this.store.empConfig.lifeCycle.beforePlugin()
    await Promise.all(runFuns)
    await this.store.empConfig.lifeCycle.afterPlugin()
  }
  beforeLifeCycle() {
    const {store} = this
    // 再所有插件初始化前 实例化 polyfill
    if (store.empConfig.build.polyfill.mode === 'entry') {
      store.chain.plugin('empPolyfill').use(EmpPolyfillPlugin)
    }
  }
  async anylayze() {
    // console.log('this.store.cliOptions.analyze', this.store.cliOptions)
    if (!this.store.cliOptions.analyze) return
    const {
      default: {BundleAnalyzerPlugin},
    } = await import('webpack-bundle-analyzer')
    this.store.chain.plugin(this.store.chainName.plugin.bundleAnalyzer).use(BundleAnalyzerPlugin, [
      {
        analyzerPort: this.store.empConfig.server.port,
        defaultSizes: 'gzip',
        analyzerHost: this.store.getLanIp() || '127.0.0.1',
      },
    ])
  }
  tsCheckerRspackPlugin() {
    if (this.store.empConfig.tsCheckerRspackPlugin === false) return false
    this.store.chain
      .plugin(this.store.chainName.plugin.tsCheckerRspackPlugin)
      .use(TsCheckerRspackPlugin, [this.store.empConfig.tsCheckerRspackPlugin])
  }
  async define() {
    this.store.chain.plugin(this.store.chainName.plugin.define).use(rspack.DefinePlugin, [this.store.empConfig.define])
  }
  async copy() {
    const publicFrom = this.store.resolve('public')
    //空文件夹不执行复制
    if (fs.existsSync(publicFrom) && fs.readdirSync(publicFrom).length > 0)
      this.store.chain.plugin(this.store.chainName.plugin.copy).use(rspack.CopyRspackPlugin, [
        {
          patterns: [
            {
              from: publicFrom,
              to: this.store.resolve(this.store.empConfig.build.outDir),
              noErrorOnMissing: true,
              globOptions: {
                // 禁止 MACOS .DS_Store 复制到代码里
                ignore: ['**/.DS_Store'],
              },
            },
          ],
        },
      ])
  }
  async progress() {
    if (!this.store.empConfig.debug.progress) return
    //
    let op: any = {}
    if (this.store.isOldRspack) {
    } else {
      op = {
        // prefix: 'EMP',
        // 是否收集进度步骤的性能数据。
        // profile: true,
        /**
         * 进度条的模板。
         * Default: ● {prefix:.bold} {bar:25.green/white.dim} ({percent}%) {wide_msg:.dim}
         */
        template: `{bar:25.green/white}{spinner:.green}{percent}% {wide_msg:.dim}`,
        // Spinner 变化的字符串序列，如果是字符串，则会被拆分为字符。
        tick: undefined,
        /**
         * 组成进度条的字符。
         * Default: ━━
         */
        progressChars: `▩▩`,
      }
    }
    //
    this.store.chain.plugin(this.store.chainName.plugin.progress).use(rspack.ProgressPlugin, [op])
  }
  // production plugin
  minify() {
    // this.store.chain.optimization.minimize(this.store.mode === 'production')
    // min js
    this.store.chain.optimization
      .minimizer(this.store.chainName.minimizer.minJs)
      .use(rspack.SwcJsMinimizerRspackPlugin, [this.store.empConfig.build.minOptions])
    // min css
    const {SwcCssMinimizerRspackPlugin, LightningCssMinimizerRspackPlugin}: any = rspack
    if (SwcCssMinimizerRspackPlugin) {
      this.store.chain.optimization
        .minimizer(this.store.chainName.minimizer.minCss)
        .use(SwcCssMinimizerRspackPlugin, [this.store.empConfig.build.cssminOptions])
    } else if (LightningCssMinimizerRspackPlugin) {
      this.store.chain.optimization
        .minimizer(this.store.chainName.minimizer.minCss)
        .use(LightningCssMinimizerRspackPlugin, [this.store.empConfig.build.cssminOptions])
    }
  }
  redoctor() {
    if (!this.store.empConfig.debug.rsdoctor) return
    const {RsdoctorRspackPlugin} = require('@rsdoctor/rspack-plugin')
    let op: RsdoctorRspackPluginOptions = {}
    if (typeof this.store.empConfig.debug.rsdoctor === 'object') op = this.store.empConfig.debug.rsdoctor
    this.store.chain.plugin(this.store.chainName.plugin.rsdoctor).use(RsdoctorRspackPlugin, [op])
  }
  sourceMapDevToolPlugin() {
    if (!this.store.empConfig.build.sourcemap) return
    let op: SourceMapDevToolPluginOptions = {}
    if (typeof this.store.empConfig.build.sourcemap === 'object') {
      op = this.store.empConfig.build.sourcemap
    }
    this.store.chain.plugin(this.store.chainName.plugin.sourceMapDevTool).use(rspack.SourceMapDevToolPlugin, [op])
  }
  circularDependency() {
    this.store.chain.plugin('circularDependency').use(rspack.CircularDependencyRspackPlugin, [{}])
  }
  // https://rspack.rs/zh/plugins/rspack/css-chunking-plugin
  cssChunkingPlugin() {
    if (!this.store.empConfig.debug.cssChunkingPlugin) return
    this.store.chain.plugin('CssChunkingPlugin').use(rspack.experiments.CssChunkingPlugin, [{}])
    // this.store.chain.plugin('CssChunkingPlugin').use(rspack.CssExtractRspackPlugin, [{}])
  }
}

export default new RspackPlugin()
