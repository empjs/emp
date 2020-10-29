const Generator = require('npm-dts').Generator
const {tuneType} = require('./helpers/tuneType')

const plugin = {
  name: 'TuneDtsPlugin',
}

const generateType = _options => {
  const generator = new Generator({..._options, logLevel: 'debug'}, true, true)

  generator
    .generate()
    .then(() => {
      tuneType(_options.path, _options.name, _options.isDefault, _options.operation)
    })
    .catch(function (e) {
      throw e
    })
}

class TuneDtsPlugin {
  constructor(options) {
    this.options = options || {}
  }

  apply(compiler) {
    const _options = this.options
    compiler.hooks.afterEmit.tap(plugin, function () {
      setTimeout(function () {
        generateType(_options)
      })
    })
  }
}

module.exports = {tuneType, generateType, TuneDtsPlugin}
