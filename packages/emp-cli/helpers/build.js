const fs = require('fs-extra')
function copyPublicFolder({public, dist, template, favicon}) {
  // console.log(public, dist, template, favicon)
  if (!fs.existsSync(public)) {
    console.warn('public not exist!')
    return
  }
  if (!fs.existsSync(dist)) {
    console.warn('dist not exist!')
    return
  }
  const filters = [template, favicon]
  fs.copySync(public, dist, {
    dereference: true,
    // filter: file => filters.indexOf(file) === -1,
    filter: file => {
      // console.error(file, filters.indexOf(file) === -1)
      return filters.indexOf(file) === -1
    },
  })
}

function buildServeConfig(path, config) {
  // console.log(path, config)
  fs.writeJson(path, config, err => {
    if (err) return console.error(err)
    // console.log('success!')
  })
}

module.exports = {copyPublicFolder, buildServeConfig}
