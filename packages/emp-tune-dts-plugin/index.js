const Generator = require('npm-dts').Generator
const {tuneType} = require('./helpers/tuneType')

const plugin = {
  name: 'TuneDtsPlugin',
}

const generateType = _options => {
  const generator = new Generator({..._options, logLevel: 'debug', force: true}, false, true)

  generator
    .generate()
    .then(() => {
      tuneType(_options.path, _options.name, _options.isDefault, _options.operation, _options.withVersion)
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
    console.log('------------TuneDtsPlugin Working----------')
    compiler.hooks.afterEmit.tap(plugin, function () {
      setTimeout(function () {
        generateType(_options)
      })
    })
    // compiler.hooks.watchRun.tap('WatchRun', comp => {
    //   if (comp.modifiedFiles) {
    //     const changedFiles = Array.from(comp.modifiedFiles, file => `\n  ${file}`).join('')
    //     generateType(_options)
    //   }
    // })
  }
}

module.exports = {tuneType, generateType, TuneDtsPlugin}
