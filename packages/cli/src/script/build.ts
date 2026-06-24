import {rspack} from '@rspack/core'
import {printFileSizes} from 'src/helper/buildPrint'
import logger from 'src/helper/logger'
import {BaseScript} from 'src/script/base'
import store, {type GlobalStore} from 'src/store'

class BuildScript extends BaseScript {
  private isWatchMode = false
  private rspackConfig!: GlobalStore['rsConfig']
  private isuseServe = false
  private isStartServe = false
  /**
   * 解决 watch mode 报错问题
   */
  private watchMode() {
    if (!this.isWatchMode) return
    this.rspackConfig.watch = true
    this.rspackConfig.optimization = {
      ...this.rspackConfig.optimization,
      moduleIds: 'named',
      chunkIds: 'named',
    }
  }
  private async startServe() {
    if (!this.isuseServe || this.isStartServe) return
    this.isStartServe = true
    const {default: serveScript} = await import('src/script/serve')
    await serveScript.setup('serve', store.cliOptions)
  }
  override async run() {
    //
    await store.empConfig.lifeCycle.beforeBuild()
    //
    this.isWatchMode = !!store.cliOptions.watch
    this.isuseServe = !!store.cliOptions.serve
    this.rspackConfig = store.rsConfig
    //
    if (this.isWatchMode) this.watchMode()
    //
    await new Promise<void>((resolve, reject) => {
      rspack(this.rspackConfig, async (err, stats) => {
        try {
          console.log('\n')
          if (store.debug.showScriptDebug) console.log(stats?.toString())
          if (err) {
            logger.error(err.stack || err)
            if (err.message) {
              logger.error(err.message)
            }
            process.exitCode = 1
            reject(err)
            return
          }
          if (!stats) {
            const error = new Error('Stats is Undefined.')
            logger.red(error.message)
            process.exitCode = 1
            reject(error)
            return
          }
          if (stats.hasErrors()) {
            logger.error(
              stats.toString({
                all: false,
                colors: true,
                // children: true,
                errors: true,
              }),
            )
            logger.red('Failed to compile.')
            process.exitCode = 1
            reject(new Error('Failed to compile.'))
            return
          }

          if (stats.hasWarnings()) {
            logger.yellow(`Compiled with warnings.`)
            logger.warn(
              stats.toString({
                all: false,
                chunks: false,
                assets: false,
                colors: true,
                // children: true,
                errors: true,
                warnings: true,
              }),
            )
          }
          //
          // logger.info(
          //   stats.toString({
          //     all: false,
          //     colors: true,
          //     assets: true,
          //     chunks: false,
          //     entrypoints: true,
          //     timings: true,
          //     version: true,
          //   }),
          // )
          //
          await printFileSizes(stats)
          //
          await this.startServe()
          await store.empConfig.lifeCycle.afterBuild()
          resolve()
        } catch (error) {
          process.exitCode = 1
          reject(error)
        }
      })
    })
  }
}
export default new BuildScript()
