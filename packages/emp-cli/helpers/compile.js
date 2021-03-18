const swc = require('@swc/core')
//
function requireFromString(src, filename) {
  const Module = module.constructor
  const m = new Module()
  m._compile(src, filename)
  return m.exports
}
function tsCompile(code) {
  return swc.transform(code, {
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
}

module.exports = {
  requireFromString,
  tsCompile,
}
