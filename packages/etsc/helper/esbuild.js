const tsPlugin = require('./tsPlugin')
const esbuild = require('esbuild')
//
module.exports = self => {
  const {entryPoints, tsconfig, watch, outdir, minify, bundle, logLevel, format, platform, target, sourcemap} = self
  const esConfig = {
    entryPoints,
    outbase: self.src,
    target,
    format,
    platform,
    outdir,
    bundle,
    watch,
    logLevel,
    minify,
    sourcemap,
    tsconfig,
    plugins: [
      tsPlugin,
      // dtsPlugin({tsconfig}),
    ],
    loader: {
      '.tsx': 'tsx',
      '.ts': 'ts',
      '.jsx': 'jsx',
      '.js': 'js',
      '.json': 'json',
    },
  }
  if (self.debug) console.log('[esConfig]\n', esConfig)
  return esbuild.build(esConfig)
}
