const transformPathsPlugin = {
  name: 'transform-paths-plugin',
  setup(build) {
    //
    const path = require('path')
    const fs = require('fs')
    const dtsGenertor = require('./dts')

    const options = build.initialOptions
    console.log('options', options)
    //
    // Redirect all paths starting with "images/" to "./public/images/"
    build.onResolve({filter: /.*/}, args => {
      // const outPath = {path: path.join(args.resolveDir, args.path)}
      const outPath = {path: path.resolve(args.resolveDir, args.path)}
      console.log('[onResolve]', args, outPath)
      return outPath
    })
    build.onLoad({filter: /.[ts|tsx]/}, async args => {
      console.log('[onLoad]', args)
      //
      let source = await fs.promises.readFile(args.path, 'utf8')
      let filename = path.relative(process.cwd(), args.path)
      const entryName = args.path.replace(`${path.dirname(args.path)}/`, '')
      console.log('[source]\n', source, args.path, '\n filename\n', filename, '\n entryName\n', entryName)
    })
    build.onEnd(result => {
      console.log('[onEnd]', `build ended with ${result.errors.length} errors`, result)
      dtsGenertor()
    })
  },
}

module.exports = transformPathsPlugin
