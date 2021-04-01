const Module = require('module')
const path = require('path')
// const fs = require('fs-extra')
//
function requireFromString(code, filename, opts) {
  if (typeof filename === 'object') {
    opts = filename
    filename = undefined
  }

  opts = opts || {}
  filename = filename || ''

  opts.appendPaths = opts.appendPaths || []
  opts.prependPaths = opts.prependPaths || []

  if (typeof code !== 'string') {
    throw new Error('code must be a string, not ' + typeof code)
  }

  var paths = Module._nodeModulePaths(path.dirname(filename))

  var parent = module.parent
  var m = new Module(filename, parent)
  m.filename = filename
  m.paths = [].concat(opts.prependPaths).concat(paths).concat(opts.appendPaths)
  m._compile(code, filename)

  var exports = m.exports
  parent && parent.children && parent.children.splice(parent.children.indexOf(m), 1)

  return exports
}
async function tsCompile(code, src) {
  /* return swc.transform(code, {
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
  }) */
  const sourceRoot = path.dirname(src)
  const tsconfig = path.join(sourceRoot, 'tsconfig.json')
  /*   const tsconfigRaw = await fs.readFile(tsconfig, 'utf8')
  const rs = await require('esbuild').transform(code, {
    format: 'cjs',
    loader: 'ts',
    tsconfigRaw,
  })
  console.log('rs', rs)
  return rs.code */
  const rs = await require('esbuild').build({
    tsconfig,
    format: 'cjs',
    bundle: true,
    platform: 'node',
    write: false,
    external: ['@efox'],
    stdin: {
      contents: code,
      loader: 'ts',
      resolveDir: sourceRoot,
    },
  })
  // console.log('rs.outputFiles[0].text', rs.outputFiles[0].text)
  return rs.outputFiles[0].text
}

module.exports = {
  requireFromString,
  tsCompile,
}
