const path = require('path')
const fs = require('fs')
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

const ConcatSource = require('webpack-sources').ConcatSource

const plugin = {
  name: 'EmpPluginShareModule',
}
/**
 * filename: emp.js
 * unpkg: true, false, default false
 * urlMap: get projectconfig value
 * unpkgUrlMap: { prod: String, test: String, dev: String} // eg: prod: https://unpkg.yy.com/@webbase/chameleonapp@beta/chameleon_share_emp.js
 */
class EmpPluginShareModule {
  constructor(options) {
    this.options = options || {}
  }
  apply(compiler) {
    const _options = this.options || {}
    const filename = _options.filename || 'emp.js'
    const unpkg = _options.unpkg || _options.unpkgUrlMap || false
    let urlMap = _options.urlMap
    let unpkgUrlMap = _options.unpkgUrlMap
    const name = _options.name || filename.split('.')[0]
    const packageJsonPath = resolveApp('package.json')
    const packageObj = require(packageJsonPath)
    const version = packageObj.version
    const v = version.replace(/\./g, '_').replace(/\-/g, '_')
    const versionName = `${name}_${v}`
    try {
      const projectPath = resolveApp('./empconfig/project-config.js')
      const {ProjectConfig} = require(projectPath)
      urlMap = urlMap || {
        prod: `${ProjectConfig.prod}${ProjectConfig.context}${filename || ProjectConfig.filename}`,
        test: `${ProjectConfig.test}${ProjectConfig.context}${filename || ProjectConfig.filename}`,
        dev: `${ProjectConfig.dev}${ProjectConfig.context}${filename || ProjectConfig.filename}`,
      }
      unpkgUrlMap = unpkgUrlMap || {
        prod: `https://unpkg.yy.com/${packageObj.name}@${packageObj.version}/dist/${ProjectConfig.filename}`,
        test: `https://unpkg.yy.com/${packageObj.name}@${packageObj.version}/dist/${ProjectConfig.filename}`,
        dev: `${ProjectConfig.dev}${ProjectConfig.context}${filename || ProjectConfig.filename}`,
      }
    } catch (e) {}
    compiler.hooks.compilation.tap(plugin, compilation => {
      // 返回 true 以输出 output 结果，否则返回 false
      compilation.hooks.optimizeChunkAssets.tap(plugin, chunks => {
        chunks.forEach(chunk => {
          chunk.files.forEach(fileName => {
            if (fileName.indexOf(filename) !== -1) {
              const asset = compilation.assets[fileName]
              let input = asset.source()
              // 修改完成后重新写回
              input = input.replace(
                'init: function() { return init; }',
                `init: function() { return init; },
                 moduleMap: function() { return moduleMap; },
                 v: function () { return '${v}' },
                 vname: function () { return '${versionName}' },
                 urlMap: function () { return JSON.parse('${JSON.stringify(urlMap)}') },
                 unpkgUrlMap: function () { return ${
                   unpkg ? `JSON.parse('${JSON.stringify(unpkgUrlMap)}')` : `null`
                 } },`,
              )
              input = input.replace(`var ${name};`, `var ${versionName}, ${name};`)
              input = input.replace(`${name} = __webpack_exports__;`, `${versionName} = ${name} = __webpack_exports__;`)
              compilation.assets[fileName] = new ConcatSource(input)
            }
          })
        })
      })
      // return true
    })
  }
}

const EmpPluginExposeListPlugin = {
  name: 'EmpPluginShareModule',
}
class EmpPluginExposeList {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.beforeRun.tap(EmpPluginExposeListPlugin, compilation => {
      console.log('EmpPluginExposeListPlugin', compilation)
    })
  }
}

module.exports = {EmpPluginShareModule, EmpPluginExposeList}
