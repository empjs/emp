// 参考 https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js
//
const {setPaths, getPaths} = require('../helpers/paths')
const {getProjectConfig} = require('../helpers/project')
const webpack = require('webpack')
const {copyPublicFolder} = require('../helpers/build')
const chalk = require('chalk')
const ora = require('ora')
const spinner = ora('=== EMP Build Start ===\n').start()
module.exports = async args => {
  const {src, dist, public} = args
  await setPaths({src, dist, public})
  const paths = getPaths()
  const config = await getProjectConfig('production', args)

  //
  webpack(config, (err, stats) => {
    if (err) {
      console.error(err.stack || err)
      if (err.details) {
        console.error(err.details)
        spinner.fail(`=== EMP Build Fail! ===\n`)
      }
      return
    }
    spinner.succeed('=== EMP Build Completed! ===\n')
    if (stats.hasWarnings()) {
      console.log(chalk.yellow.bold('\n=== EMP Compiled with warnings.===\n'))
      console.log(
        stats.toString({
          all: false,
          colors: true,
          warnings: true,
        }),
      )
    }
    //
    if (stats.hasErrors()) {
      console.log(chalk.red.bold('\n=== EMP Failed to compile.===\n'))
      const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true'
      if (tscCompileOnError) {
        console.log(
          chalk.yellow(
            'Compiled with the following type errors (you may want to check these before deploying your app):\n',
          ),
        )
      } else {
        console.log(
          stats.toString({
            all: false,
            colors: true,
            errors: true,
          }),
        )
        process.exit(1)
      }
    }
    //
    console.log(chalk.green.bold('\n=== EMP Compiled successfully.===\n'))
    console.log(
      stats.toString({
        chunks: false,
        colors: true,
        warnings: false,
        error: false,
      }),
    )
    // 复制其他文件到dist
    copyPublicFolder(paths)
  })
}
