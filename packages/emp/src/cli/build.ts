import {Configuration, webpack} from 'webpack'
import {getConfig} from 'src/helper/wpChain'
import store from 'src/helper/store'
import logger, {logTag} from 'src/helper/logger'
import {clearConsole} from 'src/helper/utils'
import wpLibMode from 'src/webpack/wpLibMode'
import {createDtsEmitThreadForBuild, emitDts} from 'src/dts'

// import reporter from 'src/helper/reporter'//使用后增加 500ms
class Build {
  config: Configuration = {}
  isLib = false
  constructor() {}
  async setup() {
    /**
     * 兼容输出到 outDir ，为了避开 clear，
     * 所以在 plugin (src\dts\index.ts) 的 afterEmit 期间执行 emit 声明类型文件
     **/
    const isTypeForOutDir = store.config.build.outDir === store.config.build.typesOutDir
    if (store.config.build.createTs && !isTypeForOutDir) {
      createDtsEmitThreadForBuild()
    }
    this.isLib = !!store.config.build.lib
    if (this.isLib) {
      /**
       * 切换到库模式
       */
      this.config = (await wpLibMode.setup()) as Configuration
    } else {
      this.config = getConfig()
    }

    if (store.config.debug.clearLog) clearConsole()
    logTag(
      `build mode ${store.config.mode}${this.isLib ? ' in [Library Mode] ' : ''} - ${
        store.config.compile.compileType
      } compile`,
      store.config.compile.compileType !== 'babel' ? 'orange' : 'blue',
    )
    // if (store.config.compile.compileType !== 'babel') logTag(`use ${store.config.compile.compileType}`, 'purple')
    // await reporter.measureFileSizesBeforeBuild()
    webpack(this.config, (err: any, stats: any) => {
      if (err) {
        logger.error(err.stack || err)
        if (err.details) {
          logger.error(err.details)
        }
        return
      }

      if (stats.hasErrors()) {
        logger.error(
          stats.toString({
            // all: false,
            colors: true,
            // errors: true,
          }),
        )
        logTag('Failed to compile.', 'red')
        if (!this.isLib) process.exit(1)
      }

      if (stats.hasWarnings()) {
        logTag(`Compiled with warnings.`, 'yellow')
        logger.warn(
          stats.toString({
            // all: false,
            colors: true,
            // warnings: true,
          }),
        )
      }

      logger.info(
        stats.toString({
          colors: true,
          all: false,
          assets: true,
          // children: true,
          // chunks: true,
          // timings: true,
          // version: true,
        }) + '\n',
      )
      logTag(`Compiled successfully.`, 'green')
      // reporter.printFileSizesAfterBuild(stats)
    })
  }
}
export default new Build()
