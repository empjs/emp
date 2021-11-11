import path from 'path'
import esbuild from 'esbuild'
import {dtsPlugin} from 'esbuild-plugin-d.ts'
import glob from 'tiny-glob'
import rimraf from 'rimraf'
import {htmlPlugin} from '@craftamap/esbuild-plugin-html'
//
const root = process.cwd()
// const mode = 'production'
const src = path.resolve(root, 'src')
const outDir = path.resolve(root, 'dist')
const tsconfig = path.resolve(root, 'tsconfig.json')

const BuildCli = async (o: any) => {
  rimraf.sync(outDir)
  const entryPoints = await glob(path.join(src, '**/**.*'))
  await esbuild.build({
    entryPoints,
    outbase: 'src',
    outdir: outDir,
    //
    minify: true,
    bundle: true,
    sourcemap: true,
    treeShaking: true,
    // format: 'cjs',
    // platform: 'node',
    inject: [path.resolve(root, 'react-shim.js')],
    // bundle: true,
    watch: false,
    // minify:true,
    tsconfig,
    metafile: true,
    plugins: [
      // dtsPlugin(),
      htmlPlugin({
        files: [
          {
            scriptLoading: 'module',
            entryPoints: ['src/index.tsx'],
            filename: 'index.html',
            htmlTemplate: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
          <div id="esmp-root">
          </div>
      </body>
      </html>
    `,
          },
        ],
      }),
    ],
    loader: {
      '.tsx': 'tsx',
      '.ts': 'ts',
      '.jsx': 'jsx',
      '.js': 'js',
      '.json': 'json',
    },
  })
}
export default BuildCli
module.exports = BuildCli
