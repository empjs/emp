const path = require('path')
class LibraryModel {
  constructor(wpchain, library, paths) {
    this.config = wpchain
    this.library = library
    this.paths = paths
    this.createLib()
  }

  createLib() {
    // console.log(this.config.entry('index'))
    // this.config.entries().delete('index').end()
    //
    const name = 'fibonacci'
    this.config.plugins
      .delete('html')
      .end()
      .output.path(path.join(this.paths.appRoot, 'dist'))
      .filename(`${name}.bundle.js`)
      .library({
        // name,
        type: 'module',
      })
    //
    /* this.config.plugin('mf').tap(args => {
      args[0] = {
        ...args[0],
        ...{
          name,
          filename: 'emp.js',
          remotes: {},
          exposes: {
            './index': 'src/index',
          },
          shared: {},
        },
      }
      return args
    }) */
    /* this.config
      .entry('index')
      .clear()
      .add(path.join(this.paths.appRoot, 'src/index.ts'))
      .end()
      .output.path(path.join(this.paths.appRoot, 'dist'))
      .filename('[name].bundle.js')
    //
    this.config.plugin('html').tap(d => {
      console.log(d)
      return []
    }) */
  }
}
module.exports = LibraryModel
