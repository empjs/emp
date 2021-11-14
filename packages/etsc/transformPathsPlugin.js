const transformPathsPlugin = {
  name: 'transform-paths-plugin',
  setup(build) {
    //
    const path = require('path')
    const fs = require('fs')
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
    build.onLoad({filter: /.*/}, async args => {
      console.log('[onLoad]', args)
      //
      let source = await fs.promises.readFile(args.path, 'utf8')
      let filename = path.relative(process.cwd(), args.path)
      console.log('source', source, args.path, 'filename', filename)
    })
    build.onEnd(result => {
      console.log('[onEnd]', `build ended with ${result.errors.length} errors`, result)
    })
  },
}

module.exports = transformPathsPlugin
