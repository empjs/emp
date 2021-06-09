const ConcatSource = require('webpack-sources').ConcatSource

const plugin = {
  name: 'EmpPluginShareModule',
}
class EmpPluginShareModule {
  constructor(options) {
    this.options = options || {}
  }
  apply(compiler) {
    const _options = this.options || {}
    const filename = _options.filename || 'sharemodule.js'
    compiler.hooks.compilation.tap(plugin, compilation => {
      // 返回 true 以输出 output 结果，否则返回 false
      compilation.hooks.optimizeChunkAssets.tap(plugin, chunks => {
        chunks.forEach(chunk => {
          chunk.files.forEach(fileName => {
            if (fileName.indexOf(filename) !== -1) {
              const asset = compilation.assets[fileName]
              let input = asset.source()
              // 修改完成后重新写回
              // input = input.replace(
              //   '__webpack_require__.p = ',
              //   `__webpack_require__.p = window.location.origin.indexOf('${origin}') === -1 ? window.location.origin + "/topic_emp_base/" : `,
              // )
              // input = input.replace('var init = ', 'var getInst = function() {return __webpack_require__;};var init = ')
              input = input.replace(
                'init: function() { return init; }',
                `init: function() { return init; },
                 moduleMap: function() { return moduleMap; }`,
              )
              compilation.assets[fileName] = new ConcatSource(input)
            }
          })
        })
      })
      // return true
    })
  }
}

module.exports = {EmpPluginShareModule}
