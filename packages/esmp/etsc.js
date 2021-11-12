const fs = require('fs-extra')
const path = require('path')
const rimraf = require('rimraf')
const cwdroot = process.cwd()
const glob = require('tiny-glob')
//
const esbuild = require('esbuild')
const {dtsPlugin} = require('esbuild-plugin-d.ts')
const {sassPlugin} = require('@es-pack/esbuild-sass-plugin')
const {lessLoader} = require('esbuild-plugin-less')
const cssModulesPlugin = require('esbuild-css-modules-plugin')
//
const isDEV = process.env.NODE_ENV === 'development'
;(async (src = 'src', watch = isDEV, out = 'dist') => {
  const tsconfigPath = path.join(cwdroot, 'tsconfig.json')
  src = path.join(cwdroot, src)
  const entryPoints = await glob(path.join(src, '**/**.*'))
  // watch = (watch !== false) ? true : false
  const outputPath = path.join(cwdroot, out)
  rimraf.sync(outputPath)
  //   console.log('entryPoints', entryPoints)
  // esbuild ./src/**/** --format=cjs --platform=node --watch --outdir=./dist --tsconfig=./tsconfig.json
  await esbuild.build({
    entryPoints,
    outbase: 'src',
    outdir: outputPath,
    format: 'cjs',
    platform: 'node',
    // bundle: true,
    watch,
    bundle: true,
    // minify:true,
    tsconfig: tsconfigPath,
    plugins: [dtsPlugin(), sassPlugin(), lessLoader(), cssModulesPlugin()],
    loader: {
      '.tsx': 'tsx',
      '.ts': 'ts',
      '.jsx': 'jsx',
      '.js': 'js',
      '.json': 'json',
      '.css': 'css',
    },
  })
})()
