const path = require('path')
const fs = require('fs')
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

const ConcatSource = require('webpack-sources').ConcatSource

const plugin = {
  name: 'EmpPluginShareModule',
}

/**
 *
 * @param {*} version 1.0.1-test.1
 * @param {*} branchName
 * @returns {test: '>1.0.1-test.0 < 1.0.1', prop: '~1.0', xyVersion: '1.0'}
 */
const getUnpkgVersion = (version, branchName = 'test') => {
  const [numberVersion, branchVersion] = version.split('-')
  let [currentVersionBranchName] = branchVersion ? branchVersion.split('.') : []
  currentVersionBranchName = currentVersionBranchName || branchName
  const bigNumberVersion = numberVersion.substr(0, numberVersion.lastIndexOf('.'))
  return {
    test: `>${numberVersion}-${currentVersionBranchName}.0 <${bigNumberVersion}`,
    prod: `~${bigNumberVersion}`,
    xyVersion: bigNumberVersion,
  }
}

/**
 * filename: emp.js
 * origin: https://www.xx.com
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
    const origin = _options.origin || 'https://unpkg.yy.com'
    const filename = _options.filename || 'emp.js'
    const unpkg = _options.unpkg || _options.unpkgUrlMap || false
    let urlMap = _options.urlMap
    let unpkgUrlMap = _options.unpkgUrlMap
    const name = _options.name || filename.split('.')[0]
    const packageJsonPath = resolveApp('package.json')
    const packageObj = require(packageJsonPath)
    // const chunkName = packageObj.name.replace(/@|\//g, '_')
    // const version = packageObj.version
    // const v = version.replace(/\./g, '_').replace(/\-/g, '_')
    // const [numberVersion, branchVersion] = version.split('-')
    // const [branchName] = branchVersion ? branchVersion.split('.') : []
    // // const versionName = `${name}_${v}`
    // const middleVersionProd = numberVersion.substr(0, numberVersion.lastIndexOf('.'))
    // // const prodVersion = `${version.}`
    const {test, prod, xyVersion} = getUnpkgVersion(packageObj.version)
    const midlleVersionPackageName = `${name}_${xyVersion.replace(/\./g, '_')}`
    console.log(
      'test:',
      test,
      'prop:',
      prod,
      'xyVersion: ',
      xyVersion,
      'midlleVersionPackageName:',
      midlleVersionPackageName,
    )

    try {
      let projectPath = ''
      try {
        projectPath = resolveApp('./empconfig/project-config.js')
      } catch (e) {
        projectPath = resolveApp('./empconfig/project-config.ts')
      }
      const {ProjectConfig} = require(projectPath)
      urlMap = urlMap || {
        prod: `${ProjectConfig.prod}${ProjectConfig.context}${filename || ProjectConfig.filename}`,
        test: `${ProjectConfig.test}${ProjectConfig.context}${filename || ProjectConfig.filename}`,
        dev: `${ProjectConfig.dev}${ProjectConfig.context}${filename || ProjectConfig.filename}`,
      }
      const prodLink = `${origin}/${packageObj.name}@${prod}/dist/${ProjectConfig.filename}`
      const testLink = `${origin}/${packageObj.name}@${test}/dist/${ProjectConfig.filename}`

      console.log('testLink', testLink)
      console.log('prodLink', prodLink)
      unpkgUrlMap = unpkgUrlMap || {
        prod: prodLink,
        test: testLink,
        dev: `${ProjectConfig.dev}${ProjectConfig.context}${filename || ProjectConfig.filename}`,
      }
    } catch (e) {}

    delete _options.remotes
    delete _options.exposes
    delete _options.unpkgUrlMap
    delete _options.urlMap

    // const regexp = new RegExp(`webpackChunk${chunkName}`, 'g')
    compiler.hooks.compilation.tap(plugin, compilation => {
      // 返回 true 以输出 output 结果，否则返回 false
      compilation.hooks.optimizeChunkAssets.tap(plugin, chunks => {
        chunks.forEach(chunk => {
          chunk.files.forEach(fileName => {
            const asset = compilation.assets[fileName]
            let input = asset.source()
            if (fileName.indexOf(filename) !== -1) {
              // 修改完成后重新写回
              input = input.replace(
                'init: function() { return init; }',
                `init: function() { return init; },
                 moduleMap: function() { return moduleMap; },
                 v: function () { return '${packageObj.version}' },
                 vname: function () { return ${unpkg ? `'${midlleVersionPackageName}'` : 'null'} },
                 urlMap: function () { return JSON.parse('${JSON.stringify(urlMap)}') },
                 unpkgUrlMap: function () { return ${unpkg ? `JSON.parse('${JSON.stringify(unpkgUrlMap)}')` : `null`} },
                 projectConfig: function () { return JSON.parse('${JSON.stringify(_options)}') },`,
              )
              input = input.replace(`var ${name};`, `var ${midlleVersionPackageName}, ${name};`)
              input = input.replace(
                `${name} = __webpack_exports__;`,
                `${midlleVersionPackageName} = ${name} = __webpack_exports__;`,
              )
              // input = input.replace(`"${name}": 0`, `"${name}": 0, "${versionName}": 0`)
              // input = input.replace(regexp, `webpackChunk${chunkName}_${v}`)
              // compilation.assets[fileName] = new ConcatSource(input)
              compilation.assets[fileName] = new ConcatSource(input)
            }
            // input = input.replace(regexp, `webpackChunk${chunkName}_${v}`)
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

module.exports = {EmpPluginShareModule, EmpPluginExposeList, getUnpkgVersion}
