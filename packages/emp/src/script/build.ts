import Paths from 'src/helper/paths'
import chalk from 'chalk'
import {webpack} from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import logger from 'src/helper/logger'
import common from 'src/webpack/common'
class Build {
  private paths: Paths
  constructor(paths: Paths) {
    this.paths = paths
    this.setup()
  }
  async setup() {
    const config = common(this.paths, 'production')

    webpack(config, (err: any, stats: any) => {
      if (err) {
        logger.error(err.stack || err)
        if (err.details) {
          logger.error(err.details)
          // spinner.fail(`=== EMP Build Fail! ===\n`)
        }
        return
      }
      // spinner.succeed('=== EMP Build Completed! ===\n')
      if (stats.hasWarnings()) {
        logger.info(chalk.yellow.bold('\n=== EMP Compiled with warnings.===\n'))
        logger.warn(
          stats.toString({
            all: false,
            colors: true,
            warnings: true,
          }),
        )
      }
      //
      if (stats.hasErrors()) {
        // const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true'
        logger.error(
          stats.toString({
            all: false,
            colors: true,
            errors: true,
          }),
        )
        logger.info(chalk.red.bold('\n=== EMP Failed to compile.===\n'))
        process.exit(1)
      }
      logger.info(chalk.green.bold('\n=== EMP Compiled successfully.===\n'))
      logger.info(
        `\n` +
          stats.toString({
            // chunks: false,
            colors: true,
            all: false,
            assets: true,
            // warnings: false,
            // error: false,
          }),
      )
      // 复制其他文件到dist
      // copyPublicFolder(paths)
      // 生成 serve 模式下需要文件
      // buildServeConfig(cachePaths.buildConfig, {devServer: config.devServer})
    })
  }
}
export default Build
