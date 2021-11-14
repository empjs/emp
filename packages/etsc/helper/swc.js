const {transformFile} = require('@swc/core')
//
module.exports = self => {
  const {entryPoints, tsconfig, watch, outdir, minify, bundle, logLevel, format, platform, target, sourcemap} = self

  if (self.debug) console.log('[esConfig]\n', esConfig)
  return transformFile('source code', {
    filename: 'input.js',
    sourceMaps: true,
    isModule: false,
    jsc: {
      parser: {
        syntax: 'ecmascript',
      },
      transform: {},
    },
  })
}
