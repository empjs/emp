// 参考 https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js
//
const {setPaths} = require('../helpers/paths')
const {getProjectConfig} = require('../helpers/project')
const webpack = require('webpack')

//

module.exports = async args => {
  const {src, dist} = args
  setPaths({src, dist})
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
    const info = stats.toJson()

    if (stats.hasErrors()) {
      console.error(info.errors)
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings)
    }
    console.log(
      stats.toString({
        chunks: false, // Makes the build much quieter
        colors: true, // Shows colors in the console
      }),
    )
  })
}
