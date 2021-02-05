const PLUGIN_NAME = 'copyPublicFolderPlugin'
const {copyPublicFolder} = require('../../helpers/build')
const {getPaths} = require('../../helpers/paths')

class copyPublicFolderPlugin {
  constructor(options) {
    this.options = {...options}
  }

  apply(compiler) {
    const onEnd = () => {
      const paths = getPaths()
      copyPublicFolder(paths)
    }

    compiler.hooks.afterEmit.tap(PLUGIN_NAME, onEnd)
  }
}

module.exports = copyPublicFolderPlugin
