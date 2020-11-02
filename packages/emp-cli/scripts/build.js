// 参考 https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js
//
const {setPaths, getPaths} = require('../helpers/paths')
const {getProjectConfig} = require('../helpers/project')
const webpack = require('webpack')
const {copyPublicFolder} = require('../helpers/build')
const chalk = require('chalk')
module.exports = async args => {
  const {src, dist, public} = args
  setPaths({src, dist, public})
  const paths = getPaths()
  const config = await getProjectConfig('production', args)
  //
  webpack(config, (err, stats) => {
    if (err) {
      console.error(err.stack || err)
      if (err.details) {
        console.error(err.details)
      }
      return
    }
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
      console.log(
        stats.toString({
          all: false,
          colors: true,
          errors: true,
        }),
      )
      process.exit(1)
      return
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
