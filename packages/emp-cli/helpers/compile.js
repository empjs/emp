// const swc = require('@swc/core')
const Module = require('module')
const path = require('path')
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
function tsCompile(code, src) {
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
  return require('esbuild').build({
    tsconfig,
    format: 'cjs',
    bundle: true,
    platform: 'node',
    write: false,
    stdin: {
      contents: code,
      loader: 'ts',
      resolveDir: sourceRoot,
    },
  })
}

module.exports = {
  requireFromString,
  tsCompile,
}
