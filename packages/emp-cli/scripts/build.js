// 参考 https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js
//
const {setPaths, getPaths, cachePaths} = require('../helpers/paths')
const {getProjectConfig} = require('../helpers/project')
const webpack = require('webpack')
const {buildServeConfig} = require('../helpers/build')
const chalk = require('chalk')
// const ora = require('ora')
const {logger, logTag} = require('../helpers/logger.js')
// const ora = require('ora')
// const spinner = ora('=== EMP Build Start ===\n').start()
module.exports = async args => {
  logTag(`build for production:`)
  // const spinner = ora('Loading...\n').start()
  //
  const {src, dist, public} = args
  await setPaths({src, dist, public})
  const paths = getPaths()
  const {webpackConfig: config, empConfig} = await getProjectConfig('production', args, paths)
  // before build hook
  if (typeof empConfig.beforeBuild === 'function') {
    await empConfig.beforeBuild(config)
  }
  //
  webpack(config, (err, stats) => {
    if (err) {
      console.error(err.stack || err)
      if (err.details) {
        console.error(err.details)
        // spinner.fail(`=== EMP Build Fail! ===\n`)
      }
      return
    }
    // spinner.succeed('=== EMP Build Completed! ===\n')
    if (stats.hasWarnings()) {
      // logger.info(chalk.yellow.bold('\n=== EMP Compiled with warnings.===\n'))
      logTag(`Compiled with warnings.`, 'yellow')
      // spinner.warn(`Compiled with warnings.`)
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
      // logger.info(chalk.red.bold('\n=== EMP Failed to compile.===\n'))
      logTag('Failed to compile.', 'red')
      // spinner.fail('Failed to compile.')
      process.exit(1)
    }
    // logger.info(chalk.green.bold('\n=== EMP Compiled successfully.===\n'))
    logger.info(
      stats.toString({
        colors: true,
        all: false,
        assets: true,
        // chunks: true,
        timings: true,
        version: true,
      }) + `\n`,
    )
    logTag(`Compiled successfully.`, 'green')
    // spinner.succeed('Compiled successfully.')
    // 复制其他文件到dist
    // copyPublicFolder(paths)
    // 生成 serve 模式下需要文件
    buildServeConfig(cachePaths.buildConfig, {devServer: config.devServer})
  })
}
