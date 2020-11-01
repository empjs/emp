// 参考 https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js
//
const {setPaths, getPaths} = require('../helpers/paths')
const {getProjectConfig} = require('../helpers/project')
const webpack = require('webpack')
const {copyPublicFolder} = require('../helpers/build')
const chalk = require('chalk')
// const fs = require('fs-extra')
module.exports = async args => {
  const {src, dist, public} = args
  setPaths({src, dist, public})
  const paths = getPaths()
  // fs.emptyDirSync(paths.dist)
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
    const info = stats.toJson({all: false, warnings: true, errors: true})

    if (stats.hasWarnings()) {
      const msg = info.warnings.map(m => m.message)
      console.log(chalk.yellow.bold('\n=== EMP Compiled with warnings.===\n'))
      console.log(chalk.bold(msg.join('\n\n')))
      /* console.log(
        '\nSearch for the ' + chalk.underline(chalk.yellow('keywords')) + ' to learn more about each warning.\n',
      ) */
    }
    //
    if (stats.hasErrors()) {
      const msg = info.errors.map(m => m.message)
      console.log(chalk.red.bold('\n=== EMP Failed to compile.===\n'))
      console.log(msg.join('\n\n'))
      process.exit(1)
    }
    //
    console.log(chalk.green.bold('\n=== EMP Compiled successfully.===\n'))
    console.log(
      stats.toString({
        chunks: false, // Makes the build much quieter
        colors: true, // Shows colors in the console
        warnings: false,
        error: false,
      }),
    )
    // 复制其他文件到dist
    copyPublicFolder(paths)
  })
}
