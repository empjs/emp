import path from 'path'
import esbuild from 'esbuild'
import {dtsPlugin} from 'esbuild-plugin-d.ts'
import glob from 'tiny-glob'
import sassPlugin from 'esbuild-plugin-sass'
import svgrPlugin from 'esbuild-plugin-svgr'
import {lessLoader} from 'esbuild-plugin-less'
import {build, formatMessages} from 'esbuild'
import {esBuildDevServer, startServer, sendError, sendReload} from 'esbuild-dev-server'
//
const root = process.cwd()
// const mode = 'development'
const src = path.resolve(root, 'src')
const outDir = path.resolve(root, 'dist')
const tsconfig = path.resolve(root, 'tsconfig.json')
const staticPath = path.resolve(root, 'public')
const devCli = async (o: any) => {
  const port = '8000'

  ;(async () => {
    const builder = await build({
      entryPoints: ['src/index.tsx'],
      bundle: true,
      minify: false,
      sourcemap: true,
      target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
      outdir: 'public/dist',
      incremental: true,
      inject: [path.resolve(root, 'react-shim.js')],
      plugins: [
        sassPlugin(),
        esBuildDevServer({
          Port: port,
          Index: 'public/index.html',
          StaticDir: 'public',
          WatchDir: 'src',
          OnLoad: async () => {
            try {
              await builder.rebuild()
              await sendReload()
            } catch (result: any) {
              const str = await formatMessages(result.errors, {kind: 'error', color: true})
              await sendError(str.join(''))
            }
          },
        }),
      ],
    })
    await startServer()
  })()

  //   esbuild
  //     .serve(
  //       {
  //         host: '0.0.0.0',
  //         servedir: src,
  //         port,
  //       },
  //       {
  //         entryPoints: [src],
  //         // outdir: outputPath,
  //         format: 'esm',
  //         treeShaking: true,
  //         bundle: true,
  //         splitting: true,
  //         external: ['react', 'react-dom', 'canvas-confetti'],
  //         // inject: [injectReact],
  //         loader: {
  //           '.tsx': 'tsx',
  //           '.ts': 'ts',
  //           '.css': 'css',
  //           '.js': 'jsx',
  //           '.svg': 'dataurl',
  //           '.png': 'dataurl',
  //         },
  //         define: {global: 'window'},
  //         plugins: [sassPlugin(), svgrPlugin(), lessLoader()],
  //       },
  //     )
  //     .then((server: any) => {
  //       console.log(`http://localhost:${port}`)
  //     })
}
export default devCli
module.exports = devCli
