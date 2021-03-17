const webpack = require('webpack')
const withReact = require('@efox/emp-react')
const swc = require('@swc/core')
const fs = require('fs-extra')
//
function isReact(remotePackageJson) {
  return (
    !!remotePackageJson.dependencies.react &&
    !remotePackageJson.devDependencies['@efox/emp-react'] &&
    !remotePackageJson.dependencies['@efox/emp-react']
  )
}

function requireFromString(src, filename) {
  const Module = module.constructor
  const m = new Module()
  m._compile(src, filename)
  return m.exports
}
async function defaultRumtime(args, empPackageJsonPath, empConfigPath, config, env, isRemoteTsConfig) {
  const empConfOpt = {...args, config, env, webpack}
  const remotePackageJson = empPackageJsonPath
    ? await fs.readJson(empPackageJsonPath)
    : {dependencies: {}, devDependencies: {}}
  //
  if (empConfigPath && !isRemoteTsConfig) {
    let remoteConfigFn = await fs.readFile(empConfigPath, 'utf8')
    remoteConfigFn = eval(remoteConfigFn)
    if (isReact(remotePackageJson)) {
      await withReact(remoteConfigFn)(empConfOpt)
    } else {
      await remoteConfigFn(empConfOpt)
    }
  } else if (empConfigPath && isRemoteTsConfig) {
    let remoteTsConfig = await fs.readFile(empConfigPath, 'utf8')
    remoteTsConfig = await swc.transform(remoteTsConfig, {
      module: {type: 'commonjs'},
      jsc: {
        externalHelpers: true,
        parser: {
          syntax: 'typescript',
          tsx: true,
          dynamicImport: true,
          decorators: true,
        },
      },
    })
    remoteTsConfig = requireFromString(remoteTsConfig.code, '')
    remoteTsConfig = remoteTsConfig.default
    console.log('remoteTsConfig', remoteTsConfig)
  } else {
    // 在没有 emp-config.js 的环境下执行
    if (remotePackageJson.dependencies.react) {
      withReact()(empConfOpt)
    }
  }
}

async function runtimeLog(args, wpc, config) {
  if (args.wplogger) {
    if (typeof args.wplogger === 'string') {
      const fileName = args.wplogger
      try {
        // webpack.config.js
        await fs.writeFile(resolveApp(fileName), `module.exports=${JSON.stringify(wpc, null, 2)}`)
      } catch (err) {
        console.error(err)
      }
    } else {
      console.log('webpack config', config.toString(), '==========')
    }
  }
  // 取消继承 minimizer TerserPlugin 让压缩更具定制化
  // if (env === 'production') wpc.optimization.minimizer.push('...')
}
module.exports = {defaultRumtime, runtimeLog}
